import { useRef, useEffect, useState } from 'react';
import './Map.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';
mapboxgl.accessToken = 'pk.eyJ1IjoiZmlzaG5uMjMiLCJhIjoiY2xpb3o4YjlhMHFjYjNkcDJiejE2aHJzYiJ9.wUWSN1ZUhOzAMpGArWidUQ';

function Map() {

    // check if on mobile or computer device --> https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // map defaults
    const mapContainer = useRef(null);
    const map = useRef(null);
    let [lng, setLng] = useState(0);
    let [lat, setLat] = useState(0);
    let [zoom, setZoom] = useState(10);

    if (isMobile) { // phone
        lng = -76.3605171;
        lat = 36.9784821;
    } else { // computer
        lng = -76.2621354;
        lat = 36.9744482;
    }

    // set states (includes axios response data) 
    let [fishingSiteData, setFishingSiteData] = useState([]);
    let [fishingTripData, setFishingTripData] = useState([]);
    let [urlInfo, setURLInfo] = useState({ url: '', shortenURL: '' }); // set popup url state
    let [fishingSites, setFishingSites] = useState({});
    let [siteMapProperties, setSiteMapProperties] = useState([]);

    // geoJSON data structure for noaa-stations layer
    let noaaStationMapProperties = [
        {
            'type': 'Feature',
            'properties': { 'stationNo': 8637689, 'name': 'Yorktown USCG Training Center' },
            'geometry': {
                'type': 'Point',
                'coordinates': [-76.47881, 37.22650]
            }
        }, {
            'type': 'Feature',
            'properties': { 'stationNo': 8632200, 'name': 'Kiptopeke' },
            'geometry': {
                'type': 'Point',
                'coordinates': [-75.98830, 37.16670]
            }
        }, {
            'type': 'Feature',
            'properties': { 'stationNo': 8638901, 'name': 'Chesapeake Channel CBBT' },
            'geometry': {
                'type': 'Point',
                'coordinates': [-76.08330, 37.03290]
            }
        }, {
            'type': 'Feature',
            'properties': { 'stationNo': 8638610, 'name': 'Sewells Point' },
            'geometry': {
                'type': 'Point',
                'coordinates': [-76.33000, 36.94667]
            }
        }, {
            'type': 'Feature',
            'properties': { 'stationNo': 8639348, 'name': 'Money Point' },
            'geometry': {
                'type': 'Point',
                'coordinates': [-76.30169, 36.77831]
            }
        }
    ];

    // custom icons
    let icon = {
        url: 'https://i.ibb.co/DfQyp9M/icons8-fish-100-1.png',
        id: 'custom-marker'
    };
    let stationIcon = {
        url: 'https://i.ibb.co/P5W4M4x/icons8-float-64.png',
        id: 'station-custom-marker'
    };

    // GET latest fishing-site data
    let [offset1, setOffset1] = useState('');
    useEffect(() => {
        axios.get(process.env.REACT_APP_FISHING_SITES_AIRTABLE)
            .then(response => {
                let data = response.data.records;
                setFishingSiteData(fishingSiteData => [...fishingSiteData, ...data]);
                if (response.data.offset) {
                    setOffset1(response.data.offset)
                }
            })
            .catch(function (error) { console.log(error); });
    }, [offset1]);

    // GET latest fishing-trip data
    let [offset2, setOffset2] = useState('');
    useEffect(() => {
        axios.get(`/` + process.env.REACT_APP_FISHING_TRIPS_AIRTABLE + `?fields%5B%5D=fishCaught&fields%5B%5D=date&fields%5B%5D=siteName`)
            .then(response => {
                let data = response.data.records;
                setFishingTripData(fishingTripData => [...fishingTripData, ...data]);
                if (response.data.offset) {
                    setOffset2(response.data.offset);
                }
            })
            .catch(function (error) { console.log(error); });
    }, [offset2]);

    // mapbox load
    useEffect(() => {

        createGeoJson(fishingSiteData);
        calculateDailyFish(fishingTripData, fishingSites);

        if (siteMapProperties.length === 0) return;

        // initialize NEW map
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [lng, lat],
            zoom: zoom
        });

        // map loading layer control
        map.current.on('load', () => {

            // load dynamic geoJSON data to map
            map.current.addSource("fishing-sites", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": siteMapProperties,
                }
            });

            // load static NOAA station geoJSON data to map
            map.current.addSource("noaa-stations", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": noaaStationMapProperties,
                }
            });

            // load custom-marker to map
            map.current.loadImage(icon.url, function (error, res) {
                map.current.addImage(icon.id, res);
            })

            // load station-custom-marker to map
            map.current.loadImage(stationIcon.url, function (error, res) {
                map.current.addImage(stationIcon.id, res);
            })

            // ... finally, add layer showing fishing sites
            map.current.addLayer({
                id: 'fishing-sites',
                type: 'symbol',
                source: 'fishing-sites',
                layout: {
                    'icon-image': 'custom-marker',
                    'icon-size': 0.55
                }
            });

            // ... and also, add layer showing noaa stations
            map.current.addLayer({
                id: 'noaa-stations',
                type: 'symbol',
                source: 'noaa-stations',
                layout: {
                    'icon-image': 'station-custom-marker',
                    'icon-size': 0.6
                }
            });

            // create popups, but don't add them to the map yet
            const popupFishSite = new mapboxgl.Popup({
                className: 'fish-site-popup ',
                closeButton: false,
                closeOnClick: false
            });

            const popupStation = new mapboxgl.Popup({
                className: 'station-popup',
                closeButton: false,
                closeOnClick: false
            });

            // popup pointer logic for fishing-sites
            map.current.on('click', 'fishing-sites', (e) => {

                // Change the cursor style as a UI indicator.
                map.current.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const siteName = e.features[0].properties.siteName;
                let rating = (Number(e.features[0].properties.rating)).toFixed(2);
                const description = e.features[0].properties.description;
                const siteURL = e.features[0].properties.siteURL;

                // modifying siteURL for webpage display
                const re = /^https:\/\/(www\.)?(.*?)\.(com|gov|org)/;
                if (siteURL === 'null') {
                    urlInfo.url = '#';
                    urlInfo.shortenURL = '';
                } else {
                    let chopped = re.exec(siteURL);
                    urlInfo.url = siteURL;
                    urlInfo.shortenURL = chopped[0];
                }

                // handling NaN (for new fishingSites with no ratings)
                isNaN(rating) ? rating = 0 : rating = rating; //-weird

                let content = ` <div id='top'>
                                    <b id='title'>${siteName}</b><br>
                                    Overall Rating: <div 
                                        style="display: inline; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
                                        ${rating}</div></br>
                                    Fish Caught Today: <div 
                                        style="display: inline; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
                                        ${fishingSites[siteName]}</div></br>
                                    Website: <div
                                        style="display: inline; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
                                        <a href='${urlInfo.url}' target='_blank'>${urlInfo.shortenURL}</a>
                                        </div></br>
                                </div>
                                <p id='bottom'>${description}</p>
                            `;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates based on the feature found.
                popupFishSite.setLngLat(coordinates).setHTML(content).addTo(map.current);
            });

            if (isMobile) {
                map.current.on('mouseleave', 'fishing-sites', () => {
                    map.current.getCanvas().style.cursor = '';
                    popupFishSite.remove();
                });
            } else {
                map.current.on('click', () => {
                    map.current.getCanvas().style.cursor = '';
                    popupFishSite.remove();
                });
            }

            // popup pointer logic for noaa-stations
            map.current.on('mouseenter', 'noaa-stations', (e) => {

                map.current.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const stationNo = e.features[0].properties.stationNo;
                const name = e.features[0].properties.name;
                let content = ` <b id='title'>${name}</b><br>
                                <h6>NOAA Station: ${stationNo}</h6>`;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                popupStation.setLngLat(coordinates).setHTML(content).addTo(map.current);
            });

            map.current.on('click', () => {
                map.current.getCanvas().style.cursor = '';
                popupStation.remove();
            });
        });
    }, [fishingSiteData]); /* useEffect() */

    // create geoJSON data structure for fishing-sites layer
    function createGeoJson(arr) {
        let fS = {};
        let sMP = [];
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            fS[arr[i].fields.siteName] = null; // stuffing site obj with every fishing-site
            sMP.push({
                'type': 'Feature',
                'properties': {
                    'siteName': arr[i].fields.siteName,
                    'rating': arr[i].fields.overallRating,
                    'siteURL': arr[i].fields.siteURL,
                    'description': arr[i].fields.description
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [arr[i].fields.longitude, arr[i].fields.latitude]
                }
            });
        }

        // updating states
        fishingSites = fS;
        siteMapProperties = sMP;
    }

    // calculate daily fish caught per fishing-site
    function calculateDailyFish(arr, obj) {

        let talliesPerSite = {};
        let currentDate = new Date().toJSON().slice(0, 10);

        for (let i = 0; i < arr.length; i++) {
            // apply daily condition filter (only interested in today's trips)
            if (arr[i].fields.date === currentDate) {
                if (talliesPerSite.hasOwnProperty(arr[i].fields.siteName)) {
                    talliesPerSite[arr[i].fields.siteName].push(arr[i].fields.fishCaught);
                } else { // initialize an empty array
                    talliesPerSite[arr[i].fields.siteName] = [];
                    talliesPerSite[arr[i].fields.siteName].push(arr[i].fields.fishCaught);
                }
            }
        }

        // total the count in the arr
        let totalPerSite = {};
        for (const [key, value] of Object.entries(talliesPerSite)) {
            let total = 0;
            for (let i = 0; i < value.length; i++) {
                total += value[i];
            }
            totalPerSite[key] = total;
        }

        // then compare to the global fishingSites obj to determine 0 or no entry
        Object.keys(obj).forEach(key => {
            if (key in totalPerSite) {
                obj[key] = totalPerSite[key];
            } else {
                obj[key] = 'No entries for this site today.';
            }
        });
        setFishingSites(obj);
    }

    return (
        <div>
            <div ref={mapContainer} className='map-container' />
        </div>
    );
}

export default Map;