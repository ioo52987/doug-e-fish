import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HelpfulFishingInfo.css';

function HelpfulFishingInfo() {

    /*ONLY NOAA STATIONS WITH WATER LEVEL DATA AND METEROLOGICAL */
    let stationNumbers = [
        {8637689: 'Yorktown USCG Training Center'},
        {8632200: 'Kiptopeke'},
        {8638901: 'Chesapeake Channel CBBT'},
        {8638610: 'Sewells Point'},
        {8639348: 'Money Point'}
    ];

    let [tideData, setTideData] = useState([]);

    // start with just today's date in the call and then make is more advance by letting
    // the user change the date
    let tideAPIcall = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20230801&end_date=20230831&station=${stationNo}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json`;

    axios.get(tideAPIcall)
        .then(response => setTideData(response.data));
    console.log(tideData);

    let recordsArr = [];
    if (tideData.records) {
        recordsArr = tideData.records;
    }

    // Digital Ocean Ref: https://www.digitalocean.com/community/tutorials/react-axios-react

    return (
        <div>
            <div className='form-content'>
                <p id='pageTitle'>Helpful Info</p>
                Made it to the HelpfulFishingInfo page!
            </div>
        </div>
    );
}

export default HelpfulFishingInfo;

/*

ONLY NOAA STATIONS WITH WATER LEVEL DATA AND METEROLOGICAL

1 Yorktown USCG Training Center 8637689
2 Kiptopeke 8632200
3 CBBT 8638901
4 Sewells Point 8638610
5 Money Point 8639348


*/