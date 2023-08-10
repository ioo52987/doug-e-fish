import React, { useRef, useEffect, useState } from 'react';
import './Map.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiZmlzaG5uMjMiLCJhIjoiY2xpb3o4YjlhMHFjYjNkcDJiejE2aHJzYiJ9.wUWSN1ZUhOzAMpGArWidUQ';

function Map() {

    // map defaults
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-76.4780485);
    const [lat, setLat] = useState(37.1460579);
    const [zoom, setZoom] = useState(10.1);
    let icons = [
        { url: 'https://i.ibb.co/g34KrBP/dad-hilton-pier.png', id: 'hiltonfishingpier' },
        { url: 'https://i.ibb.co/DLXzkpw/jeri-triangle-glasses.png', id: 'yorktownfishingpier' },
        { url: 'https://i.ibb.co/YQY5sXK/jeri-jrp.png', id: 'jamesriverfishingpier' },
        { url: 'https://i.ibb.co/Kw3CST3/dad-jrp.png', id: 'rodgersasmithlanding' }
    ];

    // initialize the map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,  // container ID
            style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
            center: [lng, lat],
            zoom: zoom // starting zoom
        });

        // map loading layer control
        map.current.on('load', () => {

            // load new data source
            map.current.addSource('fishing-spots',
                {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [{
                            'type': 'Feature',
                            'properties': {
                                'icon': 'hiltonfishingpier',
                                'description': '<strong>Hilton Fishing Pier 9/10</strong><p>Close walking distance from apartment. Seem to regularly catch something here.</p>'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-76.465550, 37.028631]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'icon': 'yorktownfishingpier',
                                'description': '<strong>Yorktown Fishing Pier 6/10</strong><p>Too far to drive since the Hilton Pier is closer. We lost two rigs in the left side of the pier. Saw dolphins. You do not need a fishing license to fish here.</p>'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-76.504707, 37.234915]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'icon': 'jamesriverfishingpier',
                                'description': '<strong>James River Fishing Pier 7/10</strong><p>Close to Hilton. You have to pay to get on but can leave with 24hr accessiblity. It is really long and always has plenty of room to fish.</p>'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-76.4564725, 37.0133489]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'icon': 'rodgersasmithlanding',
                                'description': '<strong>Rodger S. Smith Landing 2/10</strong><p>Dock was too small. Mostly a place to put in boats.</p>'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-76.4323096, 37.1340305]
                            }
                        },
                        ]
                    }
                });

            // Add images to map style
            Promise.all(
                icons.map(img => new Promise((resolve, reject) => {
                    map.current.loadImage(img.url, function (error, res) {
                        map.current.addImage(img.id, res);
                        // console.log(img.id);
                        resolve();
                    })
                }))
            )
                .then(

                    function () {

                        // Add a layer showing icons
                        map.current.addLayer({
                            id: 'fishing-spots',
                            type: 'symbol',
                            source: 'fishing-spots',
                            layout: {
                                'icon-image': ['get',
                                    'icon'],
                                'icon-size': 0.25
                            }
                        });
                    });

            // Create a popup, but don't add it to the map yet.
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            // pop-up pointer logic
            map.current.on('mouseenter', 'fishing-spots', (e) => {

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

            map.current.on('mouseleave', 'fishing-spots', () => {
                map.current.getCanvas().style.cursor = '';
                popup.remove();
            });

        }); // close
    });



    return (
        <div className="Map">
            <div className="relative">
                <div ref={mapContainer} className="map-container" />
            </div>
        </div>
    );
}

export default Map;

