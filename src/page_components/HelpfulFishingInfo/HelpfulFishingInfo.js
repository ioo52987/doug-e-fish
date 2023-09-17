import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './HelpfulFishingInfo.css';
import { MDBDataTable } from 'mdbreact';

function HelpfulFishingInfo() {

    const ref = useRef();

    /* API response data states */
    let [tideData, setTideData] = useState([]);
    let [dateValue, setDateValue] = useState(`date=today`);
    let [stationValue, setStationValue] = useState("8637689");

    useEffect(() => {

        setTideData([]); /* reset the state to clear persisting data */

        /* NOAA STATIONS WITH WATER LEVEL DATA AND METEROLOGICAL */
        let stationNos = [
            { station_no: 8637689, station_name: 'Yorktown USCG Training Center', longitude: -76.47881, latitude: 37.22650 },
            { station_no: 8632200, station_name: 'Kiptopeke', longitude: -75.98830, latitude: 37.16670 },
            { station_no: 8638901, station_name: 'Chesapeake Channel CBBT', longitude: -76.08330, latitude: 37.03290 },
            { station_no: 8638610, station_name: 'Sewells Point', longitude: -76.33000, latitude: 36.94667 },
            { station_no: 8639348, station_name: 'Money Point', longitude: -76.30169, latitude: 36.77831 }
        ];

        /* building API calls for each station */
        let frontOfAPIcall = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?`;
        let endOfAPIcall = `time_zone=lst_ldt&interval=hilo&units=english&application=dougEfish&format=json`;
        let date_param;
        if (dateValue !== `date=today`) {
            date_param = `begin_date=${dateValue}&end_date=${dateValue}`;
        } else { date_param = dateValue; }

        let tideAPIcall = `${frontOfAPIcall}${date_param}&station=${stationValue}&product=predictions&datum=MLLW&${endOfAPIcall}`;
        axios.get(tideAPIcall)
            .then(response => {
                let data = response.data.predictions;
                setTideData(tideData => [...tideData, ...data]);
            })
            .catch(function (error) { console.log(error); });
    }, [dateValue, stationValue]);

    let rows = []; /* array of objects with info about each tide at each station*/
    for(let i=0; i<tideData.length;i++){
        let obj = {
            time: tideData[i].t,
            v: tideData[i].v,
            hl_tide: tideData[i].type,
        }
        rows.push(obj);
    }

    // make MDB table here
    const data = {
        columns: [
            { label: 'Time', field: 'time' },
            { label: 'V', field: 'v'},
            { label: 'H/L Tide', field: 'hl_tide'},
        ],
        rows: rows
    };

    /* onClick grab user input date and station */
    const clickHandler = () => {

        let date = document.getElementById("date").value;
        let d = date.replace(/-/g, '');
        setDateValue(d);

        var options = document.getElementById("tide").options;
        var station = options[options.selectedIndex].id;
        setStationValue(station);
    }

    return (
        <div>
            <div className='form-content'>
                <p id='pageTitle'>Helpful Info</p>
                <div className="row input-group">
                    <div className="col-xs-2 col-md-2 field">
                        <input
                            type="text"
                            ref={ref}
                            className="form-control"
                            id="date"
                            placeholder="mm/dd/yyyy"
                            onfocus={() => (ref.current.type = "date")}
                            onBlur={() => (ref.current.type = "text")}
                        ></input>
                    </div>
                    <div className="input-group col-xs-4 col-md-4 field">
                        <select className="custom-select form-control" id="tide">
                            <option id="8637689" defaultValue>Yorktown USCG Training Center</option>
                            <option id="8632200">Kiptopeke</option>
                            <option id="8638901">Chesapeake Channel CBBT</option>
                            <option id="8638610">Sewells Point</option>
                            <option id="8639348">Money Point</option>
                        </select>
                    </div>
                    <div className="col-xs-2 col-md-4 field">
                        <button className="btn submit-btn high-tide-btn" onClick={clickHandler}>Find Tides</button>
                    </div>
                </div>

                <div>
                    <MDBDataTable
                        /*scrollY*/
                        /* tired using MDB's overflow-y but the column headers wouldn't line up 
                           even their online example had mis-aligned headers */
                        maxHeight="45vh"
                        striped
                        bordered
                        small
                        data={data}
                    />
                </div>
            </div>
        </div>
    );
}

export default HelpfulFishingInfo;


/*
let airAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=air_temperature&${endOfAPIcall}`;
let waterAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=water_temperature&${endOfAPIcall}`;
let windAPIcall = `${frontOfAPIcall}date=latest&station=8637689&product=wind&${endOfAPIcall}`;
let [airTemperature, setAirTemperature] = useState([]);
let [waterTemperature, setWaterTemperature] = useState([]);
let [wind, setWind] = useState([]);
*/