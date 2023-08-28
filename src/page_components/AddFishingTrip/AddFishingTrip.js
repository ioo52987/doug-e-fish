import React, { useState, useEffect } from 'react';
import Message from '../../reusable_components/Message/Message.js';
import './AddFishingTrip.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import FormErrors from '../../reusable_components/FormErrors/FormErrors.js';
import OverallRating from '../../reusable_components/OverallRating/OverallRating.js';

function AddFishingTrip() {

    /* DROPDOWN VALUES */
    let [dropdownValues, setDropdownValues] = useState({});
    /* FIELD VALUES */
    let [fieldValues, setFieldValues] = useState({ date: new Date(), siteName: '', tideType: '', fishCaught: '', rating: '', description: '', url: '' });
    /* FIELD VALUES VALID? */
    let [fieldValuesValid, setFieldValuesValid] = useState({ date: false, siteName: false, tideType: false, fishCaught: false, rating: false, description: false, url: false });
    /* ERROR TEXT (IF ANY) */
    let [formErrors, setFormErrors] = useState({ date: '', siteName: '', tideType: '', fishCaught: '', rating: '', description: '', url: '' });
    /* FORM VALID? STATE */
    let [formState, setFormState] = useState();

    /* DROPDOWN MENU SIZING */
    let [size, setSize] = useState(1);
    /* data passed back from child component via callback function */
    let eventhandler;

    // GET site names for dropdown field
    useEffect(() => {
        axios.get('/tbl73KANXAAstm4Kr')
            .then(response => setDropdownValues(response.data));
    }, []);

    let recordsArr = [];
    if (dropdownValues.records) {
        recordsArr = dropdownValues.records;
    }

    // alphabetize siteNames
    let pN = [];
    recordsArr.map((i) => (pN.push(i.fields.siteName)));
    let orderedPn = pN.sort();

    // form validation
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'date': /* check on this validator again, not working quite right */
                //dateValid = (/^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/).test(value);
                fieldValuesValid.date = true;
                formErrors.date = fieldValuesValid.date ? '' : ' Format mm/dd/yyyy';
                break;
            case 'siteName':
                fieldValuesValid.siteName = !(/^$/).test(value);
                formErrors.siteName = fieldValuesValid.siteName ? '' : ' Location required';
                break;
            case 'tideType':
                fieldValuesValid.tideType = (value !== '');
                formErrors.tideType = fieldValuesValid.tideType ? '' : ' Required';
                break;
            case 'fishCaught':
                fieldValuesValid.fishCaught = !(/[\.]+/).test(value);
                formErrors.fishCaught = fieldValuesValid.fishCaught ? '' : ' Integers only';
                break;
            case 'rating':
                fieldValuesValid.rating = true;
                break;
            case 'description':
                fieldValuesValid.description = (value.length >= 25 && value.length <= 1500);
                formErrors.description = fieldValuesValid.description ? '' : ' Description required to be between 25-1500 characters';
                break;
            case 'url':
                // maybe look into html input type 'url'
                fieldValuesValid.url = (/^https:\/\//).test(value);
                formErrors.url = fieldValuesValid.url ? '' : ' URL requried to begin with https:// ';
                break;
            default:
                break;
        }

        setFormErrors(formErrors);
        setFieldValuesValid(fieldValuesValid);
    }

    // on form submission...
    const handleSubmit = (event) => {

        event.preventDefault();
        formState = (fieldValuesValid.date && 
                    fieldValuesValid.siteName &&
                    fieldValuesValid.tideType &&
                    fieldValuesValid.fishCaught && 
                    fieldValuesValid.rating && 
                    fieldValuesValid.description && 
                    fieldValuesValid.url);

        if (formState) {
            axios.post("/tblZXiWg0iGnfIucV/",
                {
                    "fields": {
                        "date": document.getElementById("date").value,
                        "siteName": document.getElementById("siteName").value,
                        "tideType": document.getElementById("tideType").value,
                        "fishCaught": Number(document.getElementById("fishCaught").value),
                        "rating": document.getElementById("rating").value,
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
                            value={fieldValues.date}
                            placeholder="Date Format: ##/##/####"
                            aria-label={fieldValues.date}
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                                setFieldValues({ ...fieldValues, date: e.target.value });
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
                            id="siteName"
                            /* dropdown scroll handling */
                            size={size}
                            onFocus={() => setSize(7)}
                            onBlur={() => setSize(1)}
                            onClick={(e) => {
                                setFieldValues({ ...fieldValues, siteName: e.target.value });
                                validateField("siteName", e.target.value);
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
                            <FormErrors formErrors={formErrors} fieldName="siteName" />
                        </div>
                    </div>
                    <div className="col-2 pad">
                        <select
                            className="custom-select form-control"
                            id="tideType"
                            onClick={(e) => {
                                setFieldValues({ ...fieldValues, tideType: e.target.value });
                                validateField("tideType", e.target.value);
                            }}
                            required
                        >
                            <option value="">Tidal Info</option>
                            <option value="high tide">High Tide</option>
                            <option value="low tide">Low Tide</option>
                            <option value="ebb tide">Ebb Tide</option>
                            <option value="na">Not Applicable</option>
                        </select>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="tideType" />
                        </div>
                    </div>
                </div> {/* close row */}
                <br />
                <div className='row input-group'>
                    <div className="col-2 pad">
                        <input
                            type="number"
                            className="form-control"
                            id="fishCaught"
                            value={fieldValues.fishCaught}
                            placeholder="No. Fish Caught"
                            aria-label="No. Fish Caught"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                                setFieldValues({ ...fieldValues, fishCaught: e.target.value });;
                                validateField("fishCaught", e.target.value);
                            }}
                            min="0" max="500"
                            required
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="fishCaught" />
                        </div>
                    </div>
                    <div className='col-3'>
                        <OverallRating onClick={eventhandler} />
                    </div>
                </div> {/* close row */}
                <br />
                <div className="row input-group">
                    <div className="col-9">
                        <textarea
                            rows="5"
                            type="text"
                            className="form-control"
                            id="description"
                            value={fieldValues.description}
                            placeholder="Describe the fishing trip!"
                            aria-label="Describe the fishing trip!"
                            onChange={(e) => {
                                setFieldValues({ ...fieldValues, description: e.target.value });
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
                    <div className="col-9">
                        <input
                            type="url"
                            className="form-control"
                            id="url"
                            value={fieldValues.url}
                            placeholder="Enter an https:// to a public photo album of trip"
                            aria-label={fieldValues.url}
                            aria-describedby="basic-addon1"
                            onChange={(e) => {
                                setFieldValues({ ...fieldValues, url: e.target.value });
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
// include the star icon in being able to select
// create a custom component for overall rating, 
// let the parent get the child state by passing a callback function