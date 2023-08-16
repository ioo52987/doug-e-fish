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
    let [data, setData] = useState({});
    // custom icons
    let icon = {
        url: 'https://i.ibb.co/2ZqBZgV/clipart693648.png',
        id: 'custom-marker'
    };
    let stationIcon = {
        url: 'https://i.ibb.co/VvfdYjG/placeholder-684908.png',
        id: 'station-custom-marker'
    };

    useEffect(() => {

        // GET latest site data
        axios.get('/tbl73KANXAAstm4Kr')
            .then(response => setData(response.data));

        console.log('out');
        if (data.records) {
            console.log('in');
            let recordsArr = data.records;
            let siteMapProperties = [];
            let len = recordsArr.length;

            // create geoJSON data structure for fishing-sites
            for (let i = 0; i < len; i++) {
                siteMapProperties.push({
                    'type': 'Feature',
                    'properties': {
                        'title': recordsArr[i].fields.pierName,
                        'description': `<strong>${recordsArr[i].fields.pierName} 9/10</strong><p>${recordsArr[i].fields.description}</p>`
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [recordsArr[i].fields.longitude, recordsArr[i].fields.latitude]
                    }
                });
            }

            // geoJSON data structure for noaa-stations
            let noaaStationMapProperties = [
                {   'type': 'Feature',
                    'properties': {'title': 'NOAA Station 8637689:<br>Yorktown USCG Training Center'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-76.47881, 37.22650]
                    }
                },{ 'type': 'Feature',
                    'properties': {'title': 'NOAA Station 8632200:<br>Kiptopeke'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-75.98830, 37.16670]
                    }
                },{ 'type': 'Feature',
                    'properties': {'title': 'NOAA Station 8638901:<br>Chesapeake Channel CBBT'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-76.08330, 37.03290]
                    }
                },{ 'type': 'Feature',
                    'properties': {'title': 'NOAA Station 8638610:<br>Sewells Point'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-76.33000, 36.94667]
                    }
                },{ 'type': 'Feature',
                    'properties': {'title': 'NOAA Station 8639348:<br>Money Point'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-76.30169, 36.77831]
                    }
                }
            ];

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
                        'icon-size': 0.06
                    }
                });

                // ... and also, add layer showing noaa stations
                map.current.addLayer({
                    id: 'noaa-stations',
                    type: 'symbol',
                    source: 'noaa-stations',
                    layout: {
                        'icon-image': 'station-custom-marker',
                        'icon-size': 0.06
                    }
                });

                // Create a popup, but don't add it to the map yet
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });

                // pop-up pointer logic for fishing-sites
                map.current.on('mouseenter', 'fishing-sites', (e) => {

                    // Change the cursor style as a UI indicator.
                    map.current.getCanvas().style.cursor = 'pointer';

                    // Copy coordinates array.
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const description = e.features[0].properties.description;

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
                });

                map.current.on('mouseleave', 'fishing-sites', () => {
                    map.current.getCanvas().style.cursor = '';
                    popup.remove();
                });

                // pop-up pointer logic for noaa-stations
                map.current.on('mouseenter', 'noaa-stations', (e) => {

                    // Change the cursor style as a UI indicator.
                    map.current.getCanvas().style.cursor = 'pointer';

                    // Copy coordinates array.
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const title= e.features[0].properties.title;

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup.setLngLat(coordinates).setHTML(title).addTo(map.current);
                });

                map.current.on('mouseleave', 'noaa-stations', () => {
                    map.current.getCanvas().style.cursor = '';
                    popup.remove();
                });
            });
        }
    },[]); /* useEffect() */

    return (
        <div>
            <div ref={mapContainer} className='map-container' />
        </div>
    );
}

export default Map;


// maybe show bounding box on the map

// Ideally I need to re-engineer this yet again. Where instead of invoking useEffect() api call per component
// I have an endpoints component that can send props with all specific info to each "page" component. 
// This way there are less calls to APIs. Only when someone initially enters the site will the enpoints component be called. 
// https://www.freecodecamp.org/news/how-to-consume-rest-apis-in-react/

// actually not sure if this is better. You just make the calls you need when you access the sections of the
// site you navigate too. It depends on how the site is used.