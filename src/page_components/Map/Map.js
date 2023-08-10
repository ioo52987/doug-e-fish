import React, { useRef, useEffect, useState } from 'react';
import './Map.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';
mapboxgl.accessToken = 'pk.eyJ1IjoiZmlzaG5uMjMiLCJhIjoiY2xpb3o4YjlhMHFjYjNkcDJiejE2aHJzYiJ9.wUWSN1ZUhOzAMpGArWidUQ';

function Map() {

    // map defaults
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-76.4780485);
    const [lat, setLat] = useState(37.1460579);
    const [zoom, setZoom] = useState(10.1);
    let [data, setData] = useState({});
    // custom icon
    let icon = {
        url: 'https://i.ibb.co/2ZqBZgV/clipart693648.png',
        id: 'custom-marker'
    };

    useEffect(() => {

        // GET latest site data
        axios.get('/tbl73KANXAAstm4Kr')
            .then(response => setData(response.data));

        if (data.records) {

            let recordsArr = data.records;
            let siteMapProperties = [];
            let len = recordsArr.length;

            // create geoJSON data structure
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

                // load geoJSON data to map
                map.current.addSource("fishing-sites", {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": siteMapProperties,
                    }
                });

                // load custom-marker to map
                map.current.loadImage(icon.url, function (error, res) {
                    map.current.addImage(icon.id, res);
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

                // Create a popup, but don't add it to the map yet
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });

                // pop-up pointer logic
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
            });
        }
    }); /* useEffect() */

    return (
        <div>
            <div ref={mapContainer} className='map-container'/>
        </div>
    );
}

export default Map;