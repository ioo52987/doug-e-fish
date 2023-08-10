import React, { useState } from 'react';
import Message from '../../reusable_components/Message/Message.js';
import './AddFishingSite.css';
import axios from 'axios';
import FormErrors from '../../reusable_components/FormErrors/FormErrors.js';

function AddFishingSite() {

    /* VARIABLE VALUES */
    /* put these in a single useState obj - ... spread operator to update obj properties with setter?*/
    let [pierName, setPierName] = useState("");
    let [longitude, setLongitude] = useState("");
    let [latitude, setLatitude] = useState("");
    let [description, setDescription] = useState("");

    /* VARIABLE (VALID || INVALID) STATES */
    /* put these in a single useState obj - ... spread operator to update obj properties with setter?*/
    let [pierNameValid, setPierNameValid] = useState(false);
    let [longitudeValid, setLongitudeValid] = useState(false);
    let [latitudeValid, setLatitudeValid] = useState(false);
    let [descriptionValid, setDescriptionValid] = useState(false);

    /* FORM VALIDATION STATE */
    let [formValid, setFormValid] = useState(false);
    /* TEXT ERRORS (IF ANY)*/
    let [formErrors, setFormErrors] = useState({ pierName: '', longitude: '', latitude: '', description: '' });

    // form validation
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'pierName':
                pierNameValid = (value.length >= 3 && value.length <= 75);
                formErrors.pierName = pierNameValid ? '' : 'Site name required to be between 3-75 characters.';
                break;
            case 'longitude':
                longitudeValid = (value >= -77.58 && value <= -75.2);
                formErrors.longitude = longitudeValid ? '' : 'Range is -77.58 to -75.2';
                break;
            case 'latitude':
                latitudeValid = (value >= 36.56 && value <= 37.60);
                formErrors.latitude = latitudeValid ? '' : 'Range is 36.56 to 37.60';
                break;
            case 'description':
                descriptionValid = (value.length >= 25 && value.length <= 1500);
                formErrors.description = descriptionValid ? '' : ' Description required to be between 25-1500 characters.';
                break;
            default:
                break;
        }

        setFormErrors(formErrors);
        setPierNameValid(pierNameValid);
        setLongitudeValid(longitudeValid);
        setLatitudeValid(latitudeValid);
        setDescriptionValid(descriptionValid);
    }

    // on form submission
    const handleSubmit = (e) => {

        e.preventDefault();
        setFormValid(pierNameValid && longitudeValid && latitudeValid && descriptionValid);
        const delay = 5000; // in milliseconds
            setTimeout(() => {
                window.location.reload(true);
            }, delay);

        if (formValid) {
            axios.post("/tbl73KANXAAstm4Kr/",
                {
                    "fields": {
                        "pierName": document.getElementById("pierName").value,
                        "longitude": Number(document.getElementById("longitude").value),
                        "latitude": Number(document.getElementById("latitude").value),
                        "description": document.getElementById("description").value,
                        // maybe start overall rating at 0 here too
                    }
                }
            )
                .then((resp) => {
                    console.log("success!");
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    return (
        <div>
            <form className="form-content" onSubmit={handleSubmit} >
                <p id='pageTitle'>Add Fishing Site</p>
                <div className="row input-group">
                    <div className="col-6">
                        <input
                            type="text"
                            className="form-control"
                            id="pierName"
                            value={pierName}
                            placeholder="Fishing Site Name"
                            aria-label="Fishing Site Name"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                                setPierName(e.target.value);
                                validateField("pierName", e.target.value);
                            }}
                            minlength="3"
                            maxlength="75"
                            required
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="pierName" />
                        </div>
                    </div>
                    <div className="col-3">
                        <input
                            type="number"
                            className="form-control"
                            id="longitude"
                            value={longitude}
                            placeholder="Longitude"
                            aria-label="Longitude"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                                setLongitude(e.target.value);
                                validateField("longitude", e.target.value);
                            }}
                            step=".0000001"
                            min="-77.58" max="-75.2"
                            required
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="longitude" />
                        </div>
                    </div>
                    <div className="col-3">
                        <input
                            type="number"
                            className="form-control"
                            id="latitude"
                            value={latitude}
                            placeholder="Latitude"
                            aria-label="Latitude"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                                setLatitude(e.target.value);
                                validateField("latitude", e.target.value);
                            }}
                            step=".0000001"
                            min="36.56" max="37.60"
                            required
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="latitude" />
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
                            placeholder="Describe the new fishing site!"
                            aria-label="Describe the new fishing site!"
                            onChange={(e) => {
                                setDescription(e.target.value);
                                validateField("description", e.target.value);
                            }}
                            minlength="25"
                            maxlength="1500"
                            required
                        ></textarea>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="description" />
                        </div>
                    </div>
                </div> {/* close row */}
                <br />
                <div className="row">
                    <div className="col-2">
                        <button className="btn submit-btn" type="submit">Submit</button>
                    </div>
                    <div className="col-6">
                        <Message
                            formValid={formValid}
                            message="Success! Thanks for submitting a fishing site!  :)"
                        />
                    </div>
                </div> {/* close row */}
            </form >
            <br />
        </div >
    );
}

export default AddFishingSite;



// notes
// 1. check in place so people will not duplicate locations
// 2. bounding box
//      latitude range 36.5610543 - 37.6024947 => 36.56 - 37.60
//      longitude range -75.4199042 - -77.5756627 => -75.2 - -77.58
// 3. <Message /> needs a little UI work

// This spot looks neat! -76.504313,37.202649