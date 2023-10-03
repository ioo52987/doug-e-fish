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
    const [fishingSiteData, setFishingSiteData] = useState([]); // all site data returned from axios
    const [fishingTripData, setFishingTripData] = useState([]); // all trip data returned from axios
    let [dailyFishCaughtPerSite, setDailyFishCaughtPerSite] = useState({}); // the daily total of fish caught at each fishing-site
    let [popupData, setPopupData] = useState([]); // calculates overall rating

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
        axios.get(`/` + process.env.REACT_APP_FISHING_TRIPS_AIRTABLE + `?fields%5B%5D=fishCaught&fields%5B%5D=date&fields%5B%5D=siteName&fields%5B%5D=rating`)
            .then(response => {
                let data = response.data.records;
                setFishingTripData(fishingTripData => [...fishingTripData, ...data]);
                if (response.data.offset) {
                    setOffset2(response.data.offset);
                }
            })
            .catch(function (error) { console.log(error); });
    }, [offset2]);

    // calculate daily fish caught per fishing-site
    useEffect(() => {

        let tally = {};
        let dFC = {};
        let currentDate = new Date().toJSON().slice(0, 10);

        for (let i = 0; i < fishingTripData.length; i++) {
            // apply daily condition filter (only interested in today's trips)
            if (fishingTripData[i].fields.date === currentDate) {
                if (tally.hasOwnProperty(fishingTripData[i].fields.siteName)) {
                    tally[fishingTripData[i].fields.siteName] += Number(fishingTripData[i].fields.fishCaught);
                } else { // initialize an empty array
                    tally[fishingTripData[i].fields.siteName] = 0;
                    tally[fishingTripData[i].fields.siteName] += Number(fishingTripData[i].fields.fishCaught);
                }
            }
        }

        for (let i = 0; i < fishingSiteData.length; i++) {
            if (tally[fishingSiteData[i].fields.siteName]) {
                dFC[fishingSiteData[i].fields.siteName] = tally[fishingSiteData[i].fields.siteName];
            } else {
                dFC[fishingSiteData[i].fields.siteName] = 'No entries for this site today.'
            }
        }

        setDailyFishCaughtPerSite(dFC);
    }, [fishingSiteData, fishingTripData]);

    // calculate numTrips and overallRating per fishing-site (popupData)
    useEffect(() => {

        let objArr = [];

        // initializing structure
        for (let i = 0; i < fishingSiteData.length; i++) {
            let obj = {
                siteName: fishingSiteData[i].fields.siteName,
                ratingSum: 0,
                numTrips: 0,
                overallRating: 0
            }
            objArr.push(obj);
        }

        // sum ratings and number of trips per fishing-site
        for (let i = 0; i < fishingTripData.length; i++) {
            objArr.forEach(item => {
                if (item.siteName === fishingTripData[i].fields.siteName) {
                    item.ratingSum = item.ratingSum + fishingTripData[i].fields.rating;
                    item.numTrips++;
                }
            })
        }

        // calculate overall rating for each site
        objArr.forEach(item => {
            item.overallRating = (Number(item.ratingSum / item.numTrips).toFixed(2));
        })

        setPopupData(objArr);

    }, [fishingSiteData, fishingTripData]);

    // mapbox load
    useEffect(() => {

        // custom icons
        let fsIcon = {
            url: 'https://i.ibb.co/DfQyp9M/icons8-fish-100-1.png',
            id: 'fs-custom-marker'
        };
        let stationIcon = {
            url: 'https://i.ibb.co/P5W4M4x/icons8-float-64.png',
            id: 'station-custom-marker'
        };

        // geoJSON data structure for noaa-stations layer
        const noaaStationMapProperties =
            [
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

        // data create geoJSON stucture for each fishing-site
        //const siteMapProperties = createGeoJSON();
        //console.log(siteMapProperties); // works on last render
        //console.log(noaaStationMapProperties); // works each time

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

            // data create geoJSON stucture for each fishing-site
            let siteMapProperties = createGeoJSON();
            //console.log(siteMapProperties); // doesn't work
            //console.log(noaaStationMapProperties); // works

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

            // load fs-custom-marker to map
            map.current.loadImage(fsIcon.url, function (error, res) {
                map.current.addImage(fsIcon.id, res);
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
                    'icon-image': 'fs-custom-marker',
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


            // create geoJSON data structure for fishing-sites layer
            function createGeoJSON() {

                let sMP = [];

                // make popup for each fishing-site
                for (let i = 0; i < fishingSiteData.length; i++) {
                    popupData.forEach(item => {
                        if (item.siteName === fishingSiteData[i].fields.siteName) {
                            sMP.push({
                                'type': 'Feature',
                                'properties': {
                                    'siteName': fishingSiteData[i].fields.siteName,
                                    'overallRating': item.overallRating,
                                    'description': fishingSiteData[i].fields.description,
                                    'dFc': dailyFishCaughtPerSite[fishingSiteData[i].fields.siteName]
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [fishingSiteData[i].fields.longitude, fishingSiteData[i].fields.latitude]
                                }
                            });
                        }
                    })
                }
                console.log(sMP);
                return (sMP);
            }
        });
    }, [
        dailyFishCaughtPerSite,
        fishingSiteData,
        popupData,
        lat,
        lng,
        zoom
    ]); /* map.load useEffect() */

    return (
        <div>
            <div ref={mapContainer} className='map-container' />
        </div>
    );
}

export default Map;