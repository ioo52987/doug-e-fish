import { useState, useEffect } from 'react';
import axios from 'axios';
import "./PreviousTrips.css";
import { MDBDataTable } from 'mdbreact';

function PreviousTrips() {

    // GET previousTrips
    let [offset, setOffset] = useState('');
    let [previousTrips, setPreviousTrips] = useState([]);
    useEffect(() => {
        axios.get(`/` + process.env.REACT_APP_FISHING_TRIPS_AIRTABLE + `?offset=${offset}`)
            .then(response => {
                let data = response.data.records;
                setPreviousTrips(previousTrips => [...previousTrips, ...data]);
                if (response.data.offset) {
                    setOffset(response.data.offset)
                }
            })
            .catch(function (error) { console.log(error); });
    }, [offset])

    // put row data in correct format (array of objects)
    let rows = [];
    for (let i = 0; i < previousTrips.length; i++) {
        let obj = {
            pk: previousTrips[i].fields.pk,
            date: previousTrips[i].fields.date,
            site: previousTrips[i].fields.siteName,
            description: previousTrips[i].fields.description,
            fishCaught: previousTrips[i].fields.fishCaught,
            tideType: previousTrips[i].fields.tideType,
            photos: (previousTrips[i].fields.url) ?
                <a target="_blank" href={previousTrips[i].fields.url}>
                    <i className="fas fa-camera"></i>
                </a>
                :
                <i className="fas fa-ban"></i>,
            rating: previousTrips[i].fields.rating,
        }
        rows.push(obj);
    }

    // make MDB table here
    const data = {
        columns: [
            { label: '#', field: 'pk', sort: 'asc', width: 25 }, /* these widths aren't working */
            { label: 'Date', field: 'date', sort: 'asc', width: 65 },
            { label: 'Site', field: 'site', sort: 'asc', width: 90 },
            { label: 'Description', field: 'description', sort: '', width: 395 },
            { label: 'No.Fish', field: 'fishCaught', sort: 'asc'},
            { label: 'Tide', field: 'tideType', sort: 'asc'},
            { label: 'Photos', field: 'photos', sort: '', width: 40 },
            { label: 'Rating', field: 'rating', sort: 'asc', width: 40 }
        ],
        rows: rows
    };

    // display previousTrips in a table
    return (
        <div>
            <form className="form-content">
                <p id='pageTitle'>PreviousTrips</p>
                <div className='temp-hack-overFlw'>
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
            </form>
        </div>
    );
}

export default PreviousTrips;