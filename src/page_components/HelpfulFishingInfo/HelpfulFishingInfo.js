import { useEffect, useState } from 'react';
import axios from 'axios';
import './HelpfulFishingInfo.css';

function HelpfulFishingInfo() {

    /* NOAA STATIONS WITH WATER LEVEL DATA AND METEROLOGICAL */
    let stationNos = [
        { station_no: 8637689, station_name: 'Yorktown USCG Training Center', longitude: -76.47881, latitude: 37.22650 },
        { station_no: 8632200, station_name: 'Kiptopeke', longitude: -75.98830, latitude: 37.16670 },
        { station_no: 8638901, station_name: 'Chesapeake Channel CBBT', longitude: -76.08330, latitude: 37.03290 },
        { station_no: 8638610, station_name: 'Sewells Point', longitude: -76.33000, latitude: 36.94667 },
        { station_no: 8639348, station_name: 'Money Point', longitude: -76.30169, latitude: 36.77831 }
    ];

    /* API response data states */
    let [tideData, setTideData] = useState([]);
    let [dateValue, setDateValue] = useState('');

    /* building API calls */
    let frontOfAPIcall = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?`;
    let endOfAPIcall = `time_zone=lst_ldt&interval=hilo&units=english&application=dougEfish&format=json`;
    let date_param = `begin_date=${dateValue}&end_date=${dateValue}`;



    /*
    let airAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=air_temperature&${endOfAPIcall}`;
    let waterAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=water_temperature&${endOfAPIcall}`;
    let windAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=wind&${endOfAPIcall}`;
    let [airTemperature, setAirTemperature] = useState([]);
    let [waterTemperature, setWaterTemperature] = useState([]);
    let [wind, setWind] = useState([]);
    */

    /* calling API */
    useEffect(() => {
        /*
        axios.get(tideAPIcall)
            .then(response => setTideData(response.data.predictions))
            .catch(function (error) { console.log(error); });
        */
        /*
        axios.get(airAPIcall)
            .then(response => setAirTemperature(response.data))
            .catch(function (error) { console.log(error); });
        axios.get(waterAPIcall)
            .then(response => setWaterTemperature(response.data))
            .catch(function (error) { console.log(error); });
        axios.get(windAPIcall)
            .then(response => setWind(response.data))
            .catch(function (error) { console.log(error); });
        */
    }, []);

    function findHighTide(stationNos) {
        useEffect(() => {
        for (let i = 0; i < stationNos.length; i++) {
            let stationNo_param = stationNos[i].station_no;
            let tideAPIcall = `${frontOfAPIcall}${date_param}&station=${stationNo_param}&product=predictions&datum=MLLW&${endOfAPIcall}`;

            
            axios.get(tideAPIcall)
                .then(response => {
                    let data = response.data.predictions;
                    setTideData(tideData => [...tideData, ...data])
                })
                .catch(function (error) { console.log(error); });
           
        }
    },[]);
    }

    function findLowTide() {

    }

    return (
        <div>
            <div className='form-content'>
                <p id='pageTitle'>Helpful Info</p>

                <div className="row input-group">
                    <div className="col-2">
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            placeholder="Date Format: ##/##/####"
                            onChange={(e) => {
                                let d = e.target.value.replace(/-/g, '');
                                setDateValue(d);
                            }}
                        ></input>
                    </div>
                    <div className="col-2">
                        <button className="btn submit-btn high-tide-btn" onClick={findHighTide(stationNos)}>Find High Tide</button>
                    </div>
                    <div className="col-2">
                        <button className="btn submit-btn low-tide-btn" onClick={findLowTide()}>Find Low Tide</button>
                    </div>
                </div>


                <table className="table" id='myTable'>
                    <thead>
                        <tr>
                            <th scope="col">time</th>
                            <th scope="col">v</th>
                            <th scope="col">H/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tideData.map((i) => (
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


// notes
// tide data for any day should be accessible on the 'helpful info' page
