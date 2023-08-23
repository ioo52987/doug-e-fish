import React, { useState, useEffect } from 'react';
import Message from '../../reusable_components/Message/Message.js';
import './AddFishingTrip.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import FormErrors from '../../reusable_components/FormErrors/FormErrors.js';

function AddFishingTrip() {

    /* DROPDOWN VALUES */
    let [pierName_s, setPierName_s] = useState({});

    /* FIELD INPUT VALUES */
    let [startDate, setStartDate] = useState(new Date());
    let [pierName, setPierName] = useState("");
    let [fishCaught, setFishCaught] = useState("");
    let [rating, setRating] = useState(""); // to be added later
    let [description, setDescription] = useState("");
    let [url, setUrl] = useState("");

    /* FIELD (VALID || INVALID) STATES */
    let [dateValid, setDateValid] = useState(false);
    let [pierNameValid, setPierNameValid] = useState(false);
    let [fishCaughtValid, setFishCaughtValid] = useState(false);
    let [ratingValid, setRatingValid] = useState(false);
    let [descriptionValid, setDescriptionValid] = useState(false);
    let [urlValid, setUrlValid] = useState(false);

    /* FORM VALID? STATE */
    let [formState, setFormState] = useState();
    /* FORM ERRORS (IF ANY) */
    let [formErrors, setFormErrors] = useState({ date: '', pierName: '', fishCaught: '', rating: '', description: '', url: '' });
    /* DROPDOWN MENU SIZING */
    let [size, setSize] = useState(1);
    /* DYNAMIC ACTIVE CLASS - OVERALL RATING */
    let [activeButtons, setActiveButtons] = useState({ active1: 'undefined', 'active2': 'undefined', 'active3': 'undefined', 'active4': 'undefined', 'active5': 'undefined' });
    let [startTracker, setStarTracker] = useState(0);

    // GET site names for dropdown field
    useEffect(() => {
        axios.get('/tbl73KANXAAstm4Kr')
            .then(response => setPierName_s(response.data));
    }, []);

    let recordsArr = [];
    if (pierName_s.records) {
        recordsArr = pierName_s.records;
    }

    // alphabetize pierNames
    let pN = [];
    recordsArr.map((i) => (pN.push(i.fields.pierName)));
    let orderedPn = pN.sort();

    // handling overall rating field
    const handleClickActivation = (event) => {
        event.preventDefault();
        let eventID = Number(event.target.id);

        // special toggle
        if (eventID === 1) {
            if (activeButtons.active1 === 'active') {
                setActiveButtons({...activeButtons, 
                                    active1:'undefined', 
                                    active2:'undefined', 
                                    active3:'undefined', 
                                    active4:'undefined', 
                                    active5:'undefined'});
            }
            if(activeButtons.active1 === 'undefined'){
                setActiveButtons({...activeButtons, 
                                    active1:'active',
                                   // active2:'
                                });
            }

            // working right here . made the starTracker to keep track of previous button clicked.
            if(activeButtons.active1){

            }
        }
 
        setStarTracker(eventID); // this needs to go at the bottom after doing logic

        // would like to add logic to click back down on the selection
        // also I'd like to consolidate this logic.... it's irritating me
        // include the star icon in being able to select
    }

    // form validation
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'date': /* check on this validator again, not working quite right */
                dateValid = (/^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/).test(value);
                formErrors.date = dateValid ? '' : ' Format mm/dd/yyyy';
                break;
            case 'pierName':
                pierNameValid = !(/^$/).test(value);
                formErrors.pierName = pierNameValid ? '' : ' Location required';
                break;
            case 'fishCaught':
                fishCaughtValid = !(/[\.]+/).test(value);
                formErrors.fishCaught = fishCaughtValid ? '' : ' Integers only';
                break;
            case 'rating':
                break;
            case 'description':
                descriptionValid = (value.length >= 25 && value.length <= 1500);
                formErrors.description = descriptionValid ? '' : ' Description required to be between 25-1500 characters';
                break;
            case 'url':
                // maybe look into html input type 'url'
                urlValid = (/^https:\/\//).test(value);
                formErrors.url = urlValid ? '' : ' URL requried to begin with https:// ';
                break;
            default:
                break;
        }

        setFormErrors(formErrors);
        setDateValid(dateValid);
        setPierNameValid(pierNameValid);
        setFishCaughtValid(fishCaughtValid);
        setRatingValid(ratingValid);
        setDescriptionValid(descriptionValid);
        setUrlValid(urlValid);
    }

    // on form submission...
    const handleSubmit = (event) => {

        event.preventDefault();
        formState = (dateValid && pierNameValid && fishCaughtValid && ratingValid && descriptionValid && urlValid);

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
                    <div className="col-2 pad">
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
                                validateField("date", e.target.value);
                            }}
                            required
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="date" />
                        </div>
                    </div>
                    <div className="col-3 pad">
                        <select
                            className="custom-select form-control"
                            id="pierName"
                            /* dropdown scroll handling */
                            size={size}
                            onFocus={() => setSize(7)}
                            onBlur={() => setSize(1)}
                            onClick={(e) => {
                                setPierName(e.target.value);
                                validateField("pierName", e.target.value);
                            }}
                            onChange={(e) => {
                                setSize(1);
                                e.target.blur();
                            }}
                            required
                        >
                            <option value="">Choose Fishing Site</option>
                            {orderedPn.map((i) =>
                                (<option key={i}>{i}</option>)
                            )}
                        </select>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="pierName" />
                        </div>
                    </div>
                    <div className="col-2 pad">
                        <input
                            type="number"
                            className="form-control"
                            id="fishCaught"
                            value={fishCaught}
                            placeholder="No. Fish Caught"
                            aria-label="No. Fish Caught"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                                setFishCaught(e.target.value);
                                validateField("fishCaught", e.target.value);
                            }}
                            min="0" max="500"
                            required
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="fishCaught" />
                        </div>
                    </div>
                    <div className="col-3"> {/* use map() here */}
                        <div className="btn-group btn-group" role="group" aria-label="rating" id="rating">
                            <button type="button"
                                className={`btn btn-secondary star-btn ${activeButtons.active1}`}
                                id="1"
                                onClick={handleClickActivation}
                            ><i className="fa fa-star"></i></button>
                            <button type="button"
                                className={`btn btn-secondary star-btn ${activeButtons.active2}`}
                                id="2"
                                onClick={handleClickActivation}
                            ><i className="fa fa-star"></i></button>
                            <button type="button"
                                className={`btn btn-secondary star-btn ${activeButtons.active3}`}
                                id="3"
                                onClick={handleClickActivation}
                            ><i className="fa fa-star"></i></button>
                            <button type="button"
                                className={`btn btn-secondary star-btn ${activeButtons.active4}`}
                                id="4"
                                onClick={handleClickActivation}
                            ><i className="fa fa-star"></i></button>
                            <button type="button"
                                className={`btn btn-secondary star-btn ${activeButtons.active5}`}
                                id="5"
                                onClick={handleClickActivation}
                            ><i className="fa fa-star"></i></button>
                        </div>
                    </div>
                </div> {/* close row */}
                <br />
                <div className="row input-group">
                    <div className="col-12">
                        <textarea
                            rows="5"
                            type="text"
                            className="form-control"
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