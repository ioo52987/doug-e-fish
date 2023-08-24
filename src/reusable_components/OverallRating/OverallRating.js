import React, { useState } from 'react';
import './OverallRating.css';

function OverallRating(props) {

    /* DYNAMIC ACTIVE CLASS - OVERALL RATING */
    let [activeButtons, setActiveButtons] = useState({ active1: 'undefined', 'active2': 'undefined', 'active3': 'undefined', 'active4': 'undefined', 'active5': 'undefined' });
    let [starTracker, setStarTracker] = useState(0);

    // the event passed to parent event would also need to handle formErrors

    // handling overall rating field
    const handleClickActivation = (event) => {

        event.preventDefault();
        let eventID = Number(event.target.id);

        if (eventID === 1) {
            if (activeButtons.active1 === 'active') {
                setActiveButtons({
                    ...activeButtons,
                    active1: 'undefined',
                    active2: 'undefined',
                    active3: 'undefined',
                    active4: 'undefined',
                    active5: 'undefined'
                });
            }
            if (activeButtons.active1 === 'undefined') { // this is supposed to accout for reverse selection
                setActiveButtons({ ...activeButtons, active1: 'active' });
            }
            if ((activeButtons.active1 === 'active' && eventID < starTracker)) { // might need to reorder these if statements, put in switch with breaks
                setActiveButtons({ ...activeButtons, active1: 'undefined' });
            }
        }
        if (eventID === 2) {
            if (activeButtons.active2 === 'active') {
                setActiveButtons({
                    ...activeButtons,
                    active2: 'undefined',
                    active3: 'undefined',
                    active4: 'undefined',
                    active5: 'undefined'
                });
            }
            if (activeButtons.active2 === 'undefined') { // this is supposed to accout for reverse selection
                setActiveButtons({
                    ...activeButtons,
                    active1: 'active',
                    active2: 'active'
                });
            }
            if ((activeButtons.active2 === 'active') && (eventID < starTracker)) {
                setActiveButtons({ ...activeButtons, active2: 'undefined' });
            }
        }
        setStarTracker(eventID); // stores previous btn click
    }

    return (
        <div>
            {/* use map() here */}
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
    );
}

export default OverallRating;
