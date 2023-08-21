import React, { useRef, useEffect, useState } from 'react';
import './Map.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';
mapboxgl.accessToken = 'pk.eyJ1IjoiZmlzaG5uMjMiLCJhIjoiY2xpb3o4YjlhMHFjYjNkcDJiejE2aHJzYiJ9.wUWSN1ZUhOzAMpGArWidUQ';

function Map() {

    // map defaults
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-76.362954);
    const [lat, setLat] = useState(37.078133);
    const [zoom, setZoom] = useState(10);

    // axios response state data
    let [fishingSiteData, setFishingSiteData] = useState({});
    let [dailyFishingTripData, setDailyFishingTripData] = useState({});

    let fishingSites = {};

    // custom icons
    let icon = {
        url: 'https://i.ibb.co/DfQyp9M/icons8-fish-100-1.png',
        id: 'custom-marker'
    }; 
    let stationIcon = {
        url: 'https://i.ibb.co/P5W4M4x/icons8-float-64.png',
        id: 'station-custom-marker'
    };

    let siteMapProperties = [];
    // geoJSON data structure for noaa-stations
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
            'properties': { 'stationNo': 8632200, 'name' : 'Kiptopeke' },
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

    useEffect(() => {
        // GET latest fishing-site data
        axios.get('/tbl73KANXAAstm4Kr')
            .then(response => setFishingSiteData(response.data));
        // GET daily fishing-trip data
        axios.get('/tblZXiWg0iGnfIucV?fields%5B%5D=fishCaught&fields%5B%5D=date&fields%5B%5D=pierName') 
            .then(response => setDailyFishingTripData(response.data));
    }, []);

    // create geoJSON data structure for fishing-sites
    if (fishingSiteData.records) {
        let recordsArr = fishingSiteData.records;
        let len = recordsArr.length;
        for (let i = 0; i < len; i++) {

            // stuffing site obj
            fishingSites[recordsArr[i].fields.pierName] = null;

            siteMapProperties.push({
                'type': 'Feature',
                'properties': {
                    'pierName': recordsArr[i].fields.pierName,
                    'rating': recordsArr[i].fields.overallRating,
                    'description': recordsArr[i].fields.description
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [recordsArr[i].fields.longitude, recordsArr[i].fields.latitude]
                }
            });
        }
    }

    // calculate daily fish caught per fishing-site
    if(dailyFishingTripData.records){
        let arr = dailyFishingTripData.records;
        let talliesPerSite = {};
        let totalPerSite = {};
        let currentDate = new Date().toJSON().slice(0, 10);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].fields.date === currentDate) {
                talliesPerSite['arr[i].fields.pierName'].push(arr[i].fields.fishCaught);
            }
        }
        // total the count in the arr


        // then compare to the global fishingSites obj to determine 0 or no entry

        // then display results on the popup
    }

    useEffect(() => {

        if(siteMapProperties.length === 0) return;

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

            // Create a popups, but don't add them to the map yet
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
            map.current.on('mouseenter', 'fishing-sites', (e) => {

                // Change the cursor style as a UI indicator.
                map.current.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const pierName = e.features[0].properties.pierName;
                const rating = e.features[0].properties.rating;
                const description = e.features[0].properties.description;
                let content =   `
                                <b>${pierName}</b><br>
                                <h6>Overall Rating: ${rating}/5</br>
                                Fish Caught Today: 0</h6>
                                <p>${description}</p>
                                `;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates based on the feature found.
                popupFishSite.setLngLat(coordinates).setHTML(content).addTo(map.current);
            });

            map.current.on('mouseleave', 'fishing-sites', () => {
                map.current.getCanvas().style.cursor = '';
                popupFishSite.remove();
            });


            // popup pointer logic for noaa-stations
            map.current.on('mouseenter', 'noaa-stations', (e) => {

                map.current.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const stationNo= e.features[0].properties.stationNo;
                const name= e.features[0].properties.name;
                let content =   `<b>${name}</b><br>
                                 <h6>NOAA Station: ${stationNo}</h6>`;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                popupStation.setLngLat(coordinates).setHTML(content).addTo(map.current);
            });

            map.current.on('mouseleave', 'noaa-stations', () => {
                map.current.getCanvas().style.cursor = '';
                popupStation.remove();
            });
        });
    }, [fishingSiteData]); /* useEffect() */

return (
    <div>
        <div ref={mapContainer} className='map-container' />
    </div>
);
}

export default Map;