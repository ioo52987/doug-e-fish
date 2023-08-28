import React, { useState } from 'react';
import Message from '../../reusable_components/Message/Message.js';
import './AddFishingSite.css';
import axios from 'axios';
import FormErrors from '../../reusable_components/FormErrors/FormErrors.js';

function AddFishingSite() {

    /* FIELD VALUES */
    let [fieldValues, setFieldValues] = useState({ siteName: '', siteType: '', longitude: '', latitude: '', description: '' });
    /* FIELD VALUES VALID? */
    let [fieldValuesValid, setFieldValuesValid] = useState({ siteName: false, siteType: false, longitude: false, latitude: false, description: false });
    /* ERROR TEXT (IF ANY) */
    let [formErrors, setFormErrors] = useState({ siteName: '', siteType: '', longitude: '', latitude: '', description: '' });
    /* FORM VALIDED? STATE */
    let [formValid, setFormValid] = useState(false);

    // form validation
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'siteName':
                fieldValuesValid.siteName = (value.length >= 3 && value.length <= 75);
                formErrors.siteName = fieldValuesValid.siteName ? '' : ' Requires 3-75 characters';
                break;
            case 'siteType':
                fieldValuesValid.siteType = (value !== '');
                formErrors.siteType = fieldValuesValid.siteType ? '' : ' Required';
                break;
            case 'longitude':
                fieldValuesValid.longitude = (value >= -77.58 && value <= -75.2);
                formErrors.longitude = fieldValuesValid.longitude ? '' : ' Range is -77.58 to -75.2';
                break;
            case 'latitude':
                fieldValuesValid.latitude = (value >= 36.56 && value <= 37.60);
                formErrors.latitude = fieldValuesValid.latitude ? '' : ' Range is 36.56 to 37.60';
                break;
            case 'description':
                fieldValuesValid.description = (value.length >= 25 && value.length <= 1500);
                formErrors.description = fieldValuesValid.description ? '' : ' Description required to be between 25-1500 characters';
                break;
            default:
                break;
        }

        setFormErrors(formErrors);
        setFieldValuesValid(fieldValuesValid);
    }

    // on form submission
    const handleSubmit = (e) => {

        e.preventDefault();
        formValid = (fieldValuesValid.siteName && 
                    fieldValuesValid.siteType && 
                    fieldValuesValid.longitude && 
                    fieldValuesValid.latitude && 
                    fieldValuesValid.description);

        if (formValid) {
            axios.post("/tbl73KANXAAstm4Kr/",
                {
                    "fields": {
                        "siteName": document.getElementById("siteName").value,
                        "siteType": document.getElementById("siteType").value,
                        "longitude": Number(document.getElementById("longitude").value),
                        "latitude": Number(document.getElementById("latitude").value),
                        "description": document.getElementById("description").value,
                        // maybe start overall rating at 0 here too
                    }
                }
            )
                .then((resp) => {
                    console.log("success!!");
                    setFormValid(true);
                    const delay = 5000; // in milliseconds
                    setTimeout(() => {
                        window.location.reload(true);
                    }, delay);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    return (
        <div>
            <form className="form-content" onSubmit={handleSubmit} >
                <p id='pageTitle'>Add Fishing Site</p>
                <div className="row input-group">
                    <div className="col-3">
                        <input
                            type="text"
                            className="form-control"
                            id="siteName"
                            value={fieldValues.siteName}
                            placeholder="Fishing Site Name"
                            onChange={(e) => {
                                setFieldValues({ ...fieldValues, siteName: e.target.value });
                                validateField("siteName", e.target.value);
                            }}
                            minLength="3"
                            maxLength="75"
                            required
                        ></input>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="siteName" />
                        </div>
                    </div>
                    <div className="col-2">
                        <select
                            className="custom-select form-control"
                            id="siteType"
                            onClick={(e) => {
                                setFieldValues({ ...fieldValues, siteType: e.target.value });
                                validateField("siteType", e.target.value);
                            }}
                            required
                        >
                            <option value="">Site Type</option>
                            <option value="tidal">Tidal</option>
                            <option value="non-tidal">Non-Tidal (Pond/Lake)</option>
                        </select>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="siteType" />
                        </div>
                    </div>
                    <div className="col-2">
                        <input
                            type="number"
                            className="form-control"
                            id="longitude"
                            value={fieldValues.longitude}
                            placeholder="Longitude"
                            onChange={(e) => {
                                setFieldValues({ ...fieldValues, longitude: e.target.value });
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
                    <div className="col-2">
                        <input
                            type="number"
                            className="form-control"
                            id="latitude"
                            value={fieldValues.latitude}
                            placeholder="Latitude"
                            onChange={(e) => {
                                setFieldValues({ ...fieldValues, latitude: e.target.value });
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
                    <div className="col-9">
                        <textarea
                            rows="5"
                            type="text"
                            className="form-control"
                            id="description"
                            value={fieldValues.description}
                            placeholder="Describe the new fishing site!"
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