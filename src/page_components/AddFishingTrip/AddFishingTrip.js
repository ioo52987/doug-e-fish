import { useState, useEffect, useRef } from 'react';
import Message from '../../reusable_components/Message/Message.js';
import './AddFishingTrip.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import FormErrors from '../../reusable_components/FormErrors/FormErrors.js';
import RatingButton from '../../reusable_components/RatingButton/RatingButton.js';

function AddFishingTrip() {

    const ref = useRef();

    /* DROPDOWN VALUES */
    let [dropdownValues, setDropdownValues] = useState([]);
    /* FIELD VALUES */
    let [fieldValues, setFieldValues] = useState({
        date: new Date(),
        siteName: '',
        tideType: '',
        fishCaught: '',
        rating: '',
        description: '',
        url: ''
    });
    /* FIELD VALUES VALID? */
    let [fieldValuesValid, setFieldValuesValid] = useState({
        date: false,
        siteName: false,
        tideType: false,
        fishCaught: false,
        description: false,
        url: true // field isn't required and can submit empty
    });
    /* ERROR TEXT (IF ANY) */
    let [formErrors, setFormErrors] = useState({
        date: '',
        siteName: '',
        tideType: '',
        fishCaught: '',
        description: '',
        url: ''
    });
    /* FORM VALID? STATE */
    let [formState, setFormState] = useState();
    /* DROPDOWN MENU SIZING */
    let [size, setSize] = useState(1);

    // GET fishingSite names for dropdown field
    let [offset, setOffset] = useState('');
    useEffect(() => {
        axios.get(`/` + process.env.REACT_APP_FISHING_SITES_AIRTABLE + `?offset=${offset}`)
            .then(response => {
                let data = response.data.records;
                setDropdownValues(dropdownValues => [...dropdownValues, ...data]);
                if (response.data.offset) {
                    setOffset(response.data.offset)
                }
            })
            .catch(function (error) { console.log(error); });
    }, [offset]);

    cleanUpDropdown(dropdownValues);

    // form validation
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'date': /* check on this validator again, not working quite right */
                //dateValid = (/^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/).test(value);
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
                fieldValuesValid.fishCaught = (/^[^.]*$/).test(value); // why doesn't (in the input field) a period throw an error?
                formErrors.fishCaught = fieldValuesValid.fishCaught ? '' : ' Integers only';
                break;
            case 'description':
                fieldValuesValid.description = (value.length >= 25 && value.length <= 1500);
                formErrors.description = fieldValuesValid.description ? '' : ' Description required to be between 25-1500 characters';
                break;
            case 'url':
                fieldValuesValid.url = (/(^https:\/\/)|(^\s*$)/).test(value);
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
            fieldValuesValid.description &&
            fieldValuesValid.url);

        if (formState) {

            // get prior tripTotal and rSum record for specific fishingSite
            let newTripTotal = 0;
            let newRSum = 0;
            let recordID = '';
            for (let i = 0; i < dropdownValues.length; i++) {
                if (fieldValues.siteName === dropdownValues[i].fields.siteName) {
                    newTripTotal = dropdownValues[i].fields.tripTotal + 1;
                    newRSum = dropdownValues[i].fields.rSum + fieldValues.rating;
                    recordID = dropdownValues[i].id;
                }
            }
            // PATCH(update) fishingSite with new totals based on the fishingTrip user input
            axios.patch(`/` + process.env.REACT_APP_FISHING_SITES_AIRTABLE + `/${recordID}/`,
                {
                    "fields": {
                        "tripTotal": newTripTotal,
                        "rSum": newRSum,
                    }
                }
            )
                .then(response => console.log("PATCH success!"))
                .catch(function (error) { console.log(error) });

            // POST new fishingTrip data
            axios.post(`/` + process.env.REACT_APP_FISHING_TRIPS_AIRTABLE + `/`,
                {
                    "fields": {
                        "date": fieldValues.date,
                        "siteName": fieldValues.siteName,
                        "tideType": fieldValues.tideType,
                        "fishCaught": Number(fieldValues.fishCaught),
                        "rating": fieldValues.rating,
                        "description": fieldValues.description,
                        "url": fieldValues.url,
                    }
                }
            )
                .then((resp) => {
                    console.log("POST success!");
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

    // filter and alphabetize dropdown fishing-sites
    function cleanUpDropdown (fs){
        // remove unwated sites (designated as 'false' in the db) from appearing in the dropdown
        let pN = [];
        fs.forEach( (i) => {
            if(!i.fields.showInDropdown){
                pN.push(i.fields.siteName);
            }
        });
        // alphabetize siteNames
        dropdownValues = pN.sort();
    }

    return (
        <div>
            <form className="form-content" onSubmit={handleSubmit}>
                <p id='pageTitle'>Add Fishing Trip</p>
                <div id='rating' className='field' style={{ zIndex: 0 }}>
                    <RatingButton fieldValues={fieldValues} />
                </div>
                <div className="row input-group">
                    <div className="col-xs-2 col-md-2 field">
                        <input
                            type="text"
                            ref={ref}
                            className="form-control"
                            id="date"
                            placeholder="mm/dd/yyyy"
                            aria-label={fieldValues.date}
                            aria-describedby="basic-addon2"
                            onFocus={() => (ref.current.type = "date")}
                            onBlur={() => (ref.current.type = "text")}
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
                    <div className="col-xs-4 col-md-4 field">
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
                            {dropdownValues.map((i) =>
                                (<option key={i}>{i}</option>)
                            )}
                        </select>
                        <div className='panel panel-default'>
                            <FormErrors formErrors={formErrors} fieldName="siteName" />
                        </div>
                    </div>
                </div> {/* close row */}
                <div className="row input-group">
                    <div className="col-xs-3 col-md-3 field">
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

                    <div className="col-xs-3 col-md-3 field">
                        <input
                            type="number"
                            className="form-control"
                            id="fishCaught"
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
                </div> {/* close row */}
                <div className="row input-group">
                    <div className="col-xs-6 col-md-6 field">
                        <textarea
                            rows="5"
                            type="text"
                            className="form-control"
                            id="description"
                            placeholder="Describe the fishing trip!"
                            aria-label="Describe the fishing trip!"
                            onChange={(e) => {
                                setFieldValuesValid({ ...fieldValuesValid, 'url': false })
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
                <div className="row input-group">
                    <div className="col-xs-6 col-md-6 field">
                        <input
                            type="url"
                            className="form-control"
                            id="url"
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
                <div className="row">
                    <div className="col-xs-2 col-md-2 field">
                        <button className="btn submit-btn" type="submit">Submit</button>
                    </div>
                    <div className="col-xs-7 col-md-7 field message">
                        <Message
                            formValid={formState}
                            message="Success! Thanks for submitting a trip!"
                        />
                    </div>
                </div> {/* close row */}
            </form >
        </div >
    );
}

export default AddFishingTrip;
