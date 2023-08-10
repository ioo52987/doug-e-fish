import React, { useState } from 'react';
import axios from 'axios';
import './HelpfulFishingInfo.css';

function HelpfulFishingInfo() {

    let [tideData, setTideData] = useState([]);

    axios.get(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20230801&end_date=20230831&station=8637689&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=xml`)
        .then(res => {
            const tides = res.data; // getting xml data, but the setter isn't working correctly (tideData is empty)
            setTideData({ tides }); // need to figure out how to parse xml data
            console.log(tideData);
        })

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