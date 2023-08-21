import React, { useState, useEffect } from 'react';
import Message from '../../reusable_components/Message/Message.js';
import './AddFishingTrip.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import FormErrors from '../../reusable_components/FormErrors/FormErrors.js';

function AddFishingTrip() {

    /* FIELD INPUT VALUES */
    let [startDate, setStartDate] = useState(new Date());
    let [pierNames, setPierNames] = useState({});
    let [fishCaught, setFishCaught] = useState("");
    let [rating, setRating] = useState(""); // to be added later
    let [description, setDescription] = useState("");
    let [url, setUrl] = useState("");

    /* FIELD (VALID || INVALID) STATES */
    let [pierNamesValid, setPierNamesValid] = useState(false);
    let [fishCaughtValid, setFishCaughtValid] = useState(false);
    let [ratingValid, setRatingValid] = useState(false);
    let [descriptionValid, setDescriptionValid] = useState(false);
    let [urlValid, setUrlValid] = useState(false);

    /* FORM VALID? STATE */
    let [formState, setFormState] = useState();
    /* TEXT ERRORS (IF ANY) */
    let [formErrors, setFormErrors] = useState({ pierName: '', fishCaught: '', rating: '', description: '', url: '' });

    // GET site names for dropdown field
    useEffect(() => {
        axios.get('/tbl73KANXAAstm4Kr')
            .then(response => setPierNames(response.data));
    }, []);

    let recordsArr = [];
    if (pierNames.records) {
        recordsArr = pierNames.records;
    }

    // form validation
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'pierName':
                pierNames = true;
                break;
            case 'fishCaught':
                // convert string to a number and throw warning.
                break;
            case 'rating':
                break;
            case 'description':
                descriptionValid = (value.length >= 25 && value.length <= 1500);
                formErrors.description = descriptionValid ? '' : ' Description required to be between 25-1500 characters.';
                break;
            case 'url':
                urlValid = (/^https:\/\//).test(value);
                formErrors.url = urlValid ? '' : 'url requried to begin with \'https://\'.';
                break;
            default:
                break;
        }

        setFormErrors(formErrors);
        setPierNamesValid(pierNamesValid);
        setFishCaught(fishCaughtValid);
        setRating(ratingValid);
        setDescriptionValid(descriptionValid);
        setUrlValid(urlValid);
    }

    // on form submission...
    const handleSubmit = (event) => {

        event.preventDefault();
        formState = (pierNamesValid && fishCaughtValid && ratingValid && descriptionValid && urlValid);

        if (formState) {
            axios.post("/tblZXiWg0iGnfIucV/",
                {
                    "fields": {
                        "date": document.getElementById("date").value,
                        "pierName": document.getElementById("pierName").value,
                        "fishCaught": Number(document.getElementById("fishCaught").value),
                        //"rating": document.getElementById("rating").value,
                        "description": document.getElementById("description").value,
                        "url": document.getElementById("url").value,
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
        }
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
                            onChange={(e) => {
                                setStartDate(e.target.value);
                            }}
                            required
                        ></input>
                    </div>
                    <div className="col-3">
                        <select
                            className="custom-select form-control scrollable-dropdown"
                            id="pierName"
                            required
                        >
                            <option disabled selected>Choose Fishing Site</option>
                            {recordsArr.map((i) =>
                                (<option key={i.fields.pierName}>{i.fields.pierName}</option>)
                            )}
                        </select>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="pierName" />
                        </div>
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
                            onChange={(e) => {
                                setFishCaught(e.target.value);
                                validateField("fishCaught", e.target.value);
                            }}
                            required
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="fishCaught" />
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="btn-group btn-group" role="group" aria-label="Basic example" id="rating">
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
                            onChange={(e) => {
                                setDescription(e.target.value);
                                validateField("description", e.target.value);
                            }}
                            minLength="25"
                            maxLength="1500"
                            required
                        ></textarea>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="description" />
                        </div>
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
                            onChange={(e) => {
                                setUrl(e.target.value);
                                validateField("url", e.target.value);
                            }}
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="url" />
                        </div>
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
// 
// right now the form is letting me submit with no actual selection of the dropdown
// and does not mark the <select> input as invalid with the css pseudo class pink outline
// This is I've preselected the 'choice' vernacular.... not sure how to handle this
// https://jqueryvalidation.org/ per this https://stackoverflow.com/questions/20137036/first-option-of-dropdown-not-an-option-force-to-use-other-options
// I need the form not to submit if the diabled option is selected.
// 
// zero fish caught different then no entry
// sometimes there is only one high tide returned from NOAA because the next high tide is 12am sometime.
// maybe put the day the tide data is being draw on with the tide data
// tide data for any day should be accessible on the 'helpful info' page