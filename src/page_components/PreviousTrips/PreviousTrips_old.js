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
                setPreviousTrips(previousTrips=>[...previousTrips, ...data]);
                if (response.data.offset) {
                    setOffset(response.data.offset)
                }
            })
            .catch(function (error) { console.log(error); });
    }, [offset])

    // create MDB table here

 


    // display previousTrips in a table
    return (
        <div>
            <div className="wrapper">
                <div className='table-content'>
                    <p id='pageTitle'>PreviousTrips</p>
                    <table className="table table-bordered table-striped mb-0">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Date</th>
                                <th scope="col">Site</th>
                                <th scope="col">Description</th>
                                <th scope="col">Photos</th>
                                <th scope="col">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                previousTrips.map((i) => (
                                    <tr>
                                        <td key="1">{i.fields.pk}</td>
                                        <td key='2'>{i.fields.date}</td>
                                        <td key='3'>{i.fields.siteName}</td>
                                        <td key='4'>{i.fields.description}</td>
                                        <td key='5'>
                                            {(i.fields.url) ?
                                                <a href={i.fields.url}>
                                                    <i className="fas fa-camera"></i>
                                                </a>
                                                :
                                                <i className="fas fa-ban"></i>
                                            }
                                        </td>
                                        <td key='6'>{i.fields.rating}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}

export default PreviousTrips;

// Do I want a basic table sort? || Do I want to filter and sort?
// this one is cool too https://www.npmjs.com/package/simple-datatables
// checkout the style of it's demo. It's awesome.
// https://blog.devgenius.io/simple-datatables-a-vanilla-js-alternative-to-datatables-72f116565e39