import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HelpfulFishingInfo.css';

function HelpfulFishingInfo() {

    /*ONLY NOAA STATIONS WITH WATER LEVEL DATA AND METEROLOGICAL */
    let stationNos = [
        {   'station_no': 8637689,
            'station_name': 'Yorktown USCG Training Center',
            'longitude': -76.47881,
            'latitude': 37.22650
        },
        {   'station_no': 8632200,
            'station_name': 'Kiptopeke',
            'longitude': -75.98830,
            'latitude': 37.16670
        },
        {   'station_no': 8638901,
            'station_name': 'Chesapeake Channel CBBT',
            'longitude': -76.08330,
            'latitude': 37.03290
        },
        {   'station_no': 8638610,
            'station_name': 'Sewells Point',
            'longitude': -76.33000,
            'latitude': 36.94667
        },
        {   'station_no': 8639348,
            'station_name': 'Money Point',
            'longitude': -76.30169,
            'latitude': 36.77831
        }
    ];

    /* building API calls */
    let frontOfAPIcall = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?`;
    let endOfAPIcall = `time_zone=lst_ldt&interval=hilo&units=english&application=dougEfish&format=json`;
    let tideAPIcall = `${frontOfAPIcall}date=today&station=8637689&product=predictions&datum=MLLW&${endOfAPIcall}`;
    let airAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=air_temperature&${endOfAPIcall}`;
    let waterAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=water_temperature&${endOfAPIcall}`;
    let windAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=wind&${endOfAPIcall}`;

    /* API response data states */
    let [tideData, setTideData] = useState([]);
    let [airTemperature, setAirTemperature] = useState([]);
    let [waterTemperature, setWaterTemperature] = useState([]);
    let [wind, setWind] = useState([]);

    /* calling API */
    axios.get(tideAPIcall)
        .then(response => setTideData(response.data));
    axios.get(airAPIcall)
        .then(response => setAirTemperature(response.data));
    axios.get(waterAPIcall)
        .then(response => setWaterTemperature(response.data));
    axios.get(windAPIcall)
        .then(response => setWind(response.data));


    let recordsArr = [];
    if (tideData.predictions) {
        recordsArr = tideData.predictions;
    }

    // Digital Ocean Ref: https://www.digitalocean.com/community/tutorials/react-axios-react

    return (
        <div>
            <div className='form-content'>
                <p id='pageTitle'>Helpful Info</p>
                Made it to the HelpfulFishingInfo page!
                <table className="table" id='myTable'>
                    <thead>
                        <tr>
                            <th scope="col">time</th>
                            <th scope="col">v</th>
                            <th scope="col">H/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordsArr.map((i) => (
                            <tr>
                                <td>{i.t}</td>
                                <td>{i.v}</td>
                                <td>{i.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HelpfulFishingInfo;
