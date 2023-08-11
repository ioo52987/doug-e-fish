import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HelpfulFishingInfo.css';

function HelpfulFishingInfo() {

    /*ONLY NOAA STATIONS WITH WATER LEVEL DATA AND METEROLOGICAL */
    let stationNos = {
        8637689: 'Yorktown USCG Training Center',
        8632200: 'Kiptopeke',
        8638901: 'Chesapeake Channel CBBT',
        8638610: 'Sewells Point',
        8639348: 'Money Point'
    };

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
