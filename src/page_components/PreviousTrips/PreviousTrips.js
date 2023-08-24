import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./PreviousTrips.css";
//import {DataTable} from "simple-datatables";

function PreviousTrips() {

    let [data, setData] = useState({});

    useEffect(() => {
        // GET from airtable all of the trips in the database with an axios call, might need to handle 'Pages'
        axios.get('/tblZXiWg0iGnfIucV')
            .then(response => setData(response.data));
    }, []);

    let recordsArr = [];
    if (data.records) {
        recordsArr = data.records;
    }

    //const dataTable = new DataTable("#myTable");


    // then display trips down here
    return (
        <div>
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
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
                            {recordsArr.map((i) => (
                                <tr>
                                    <td>{i.fields.pk}</td>
                                    <td>{i.fields.date}</td>
                                    <td>{i.fields.pierName}</td>
                                    <td>{i.fields.description}</td>
                                    <td>
                                        <a href={i.fields.url}>
                                            <i className="fas fa-camera"></i>
                                        </a>
                                    </td>
                                    <td>{i.fields.rating}</td>
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