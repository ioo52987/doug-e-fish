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
            photos:  (previousTrips[i].fields.url) ?
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
            { label: '#', field: 'pk', sort: 'asc', width: 50 },
            { label: 'Date', field: 'date', sort: 'asc', width: 50 },
            { label: 'Site', field: 'site', sort: 'asc', width: 200 },
            { label: 'Description', field: 'description', sort: '', width: 200 },
            { label: 'Photos', field: 'photos', sort: '', width: 100 },
            { label: 'Rating', field: 'rating', sort: 'asc', width: 100 }
        ],
        rows: rows
    };

    // display previousTrips in a table
    return (
        <div>
            <p id='pageTitle'>PreviousTrips</p>
            <div className='wrapper'>
                <MDBDataTable
                    striped
                    bordered
                    small
                    data={data}
                />
            </div>
        </div>
    );
}

export default PreviousTrips;