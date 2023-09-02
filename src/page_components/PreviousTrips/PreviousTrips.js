import { useState, useEffect } from 'react';
import axios from 'axios';
import "./PreviousTrips.css";

function PreviousTrips() {

    let [offsetID, setOffset] = useState('');
    let ALL_PreviousTrips = [];

    useEffect(() => {

        // GET from airtable all fishingTrips - Airtable limits api calls to 100 records 
        axios.get(`/tblZXiWg0iGnfIucV?offset=${offsetID}`)
            .then(res => {
                ALL_PreviousTrips.concat(res.data.records);
                if (res.data.offset) {
                    setOffset(res.data.offset);
                }
            })
            .catch(function (error) { console.log(error); });

    }, [offsetID]);


    // display previousTrips in a table
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
                            {ALL_PreviousTrips.map((i) => (
                                <tr>
                                    <td>{i.fields.pk}</td>
                                    <td>{i.fields.date}</td>
                                    <td>{i.fields.siteName}</td>
                                    <td>{i.fields.description}</td>
                                    <td>
                                        {(i.fields.url) ?
                                            <a href={i.fields.url}>
                                                <i className="fas fa-camera"></i>
                                            </a>
                                            :
                                            <i className="fas fa-ban"></i>
                                        }
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