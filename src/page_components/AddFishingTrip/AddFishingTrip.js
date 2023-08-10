import React, { useState, useEffect } from 'react';
import Message from '../../reusable_components/Message/Message.js';
import './AddFishingTrip.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function AddFishingTrip() {

    let [pierNames, setPierNames] = useState({});
    let [startDate, setStartDate] = useState(new Date());
    let [fishCaught, setFishCaught] = useState();
    let [rating, setRating] = useState(""); // to be added later
    let [description, setDescription] = useState("");
    let [url, setUrl] = useState("");
    let [formState, setFormState] = useState();

    // GET site names
    useEffect(() => {
        axios.get('/tbl73KANXAAstm4Kr')
            .then(response => setPierNames(response.data));
    }, []);

    let recordsArr = [];
    if (pierNames.records) {
        recordsArr = pierNames.records;
    }

    // on form submission...
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("/tblZXiWg0iGnfIucV/",
            {
                "fields": {
                    "date": document.getElementById("date").value,
                    "pierName": document.getElementById("pierName").value,
                    "description": document.getElementById("description").value,
                    "url": document.getElementById("url").value,
                    "fishCaught": Number(document.getElementById("fishCaught").value)
                }
            }
        )
            .then((resp) => {
                console.log("success!");
                setFormState(true);
                const delay = 5000; // milliseconds
                setTimeout(() => {
                    window.location.reload(true);
                }, delay)
            })
            .catch(function (error) {
                console.log(error);
                setFormState(false);
            });
    };

    return (
        <div>
            <form className="form-content" onSubmit={handleSubmit}>
                <p id='pageTitle'>Add Fishing Trip</p>
                <div className="row input-group">
                    <div className="col-2">
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            value={startDate}
                            placeholder="Date Format: ##/##/####"
                            aria-label={startDate}
                            aria-describedby="basic-addon2"
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div className="col-3">
                        <select
                            className="custom-select form-control"
                            id="pierName"
                            required
                        >
                            <option disabled selected>Choose Fishing Site</option>
                            {recordsArr.map((i) => (<option key={i.fields.pierName}>{i.fields.pierName}</option>))}
                        </select>
                    </div>
                    <div className="col-2">
                        <input
                            type="number"
                            className="form-control"
                            id="fishCaught"
                            value={fishCaught}
                            placeholder="No. Fish Caught"
                            aria-label={fishCaught}
                            aria-describedby="basic-addon2"
                            onChange={(e) => setFishCaught(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div className="col-3">
                        <div className="btn-group btn-group" role="group" aria-label="Basic example" id="tripRating">
                            <button type="button" className="btn btn-secondary star-btn" id="star-one"><i className="fa fa-star"></i></button>
                            <button type="button" className="btn btn-secondary star-btn" id="star-two"><i className="fa fa-star"></i></button>
                            <button type="button" className="btn btn-secondary star-btn" id="star-three"><i className="fa fa-star"></i></button>
                            <button type="button" className="btn btn-secondary star-btn" id="star-four"><i className="fa fa-star"></i></button>
                            <button type="button" className="btn btn-secondary star-btn" id="star-five"><i className="fa fa-star"></i></button>
                        </div>
                    </div>
                </div> {/* close row */}
                <br />
                <div className="row input-group">
                    <div className="col-12">
                        <textarea
                            rows="5"
                            type="text"
                            class="form-control"
                            id="description"
                            value={description}
                            placeholder="Describe the fishing trip!"
                            aria-label="Describe the fishing trip!"
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                </div> {/* close row */}
                <br />
                <div className="row input-group">
                    <div className="col-12">
                        <input
                            type="url"
                            className="form-control"
                            id="url"
                            value={url}
                            placeholder="Enter an https:// to a public photo album of trip"
                            aria-label={url}
                            aria-describedby="basic-addon1"
                            onChange={(e) => setUrl(e.target.value)}
                        ></input>
                    </div>
                </div> {/* close row */}
                <br />
                <div className="row">
                    <div className="col-2">
                        <button className="btn submit-btn" type="submit">Submit</button>
                    </div>
                    <div className="col-10 message">
                        <Message
                            formState={formState}
                            message="Success! Thanks for submitting a fishing trip!  :)"
                        />
                    </div>
                </div> {/* close row */}
            </form >
        </div >
    );
}

export default AddFishingTrip;


// notes
// foreign key requirements to link pier to trips with primary key (pk)
// not sure this is even possible with AirTable (1:many) ratio - I'll look into it later
// 
// right now the form is letting me submit with no actual selection of the dropdown
// and does not mark the <select> input as invalid with the css pseudo class pink outline
// This is I've preselected the 'choice' vernacular.... not sure how to handle this
// https://jqueryvalidation.org/ per this https://stackoverflow.com/questions/20137036/first-option-of-dropdown-not-an-option-force-to-use-other-options
// I need the form not to submit if the diabled option is selected.
// 
// Also dropdown box auto complete option
// Airtable has a field type called 'link to another record' AKA foreign key