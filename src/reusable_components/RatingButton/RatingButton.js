import { useState } from 'react';
import './RatingButton.css';

function RatingButton() {

    /* DYNAMIC ACTIVE CLASS - RATING */
    let [activeButtons, setActiveButtons] = useState({
        active1: 'undefined',
        active2: 'undefined',
        active3: 'undefined',
        active4: 'undefined',
        active5: 'undefined',
    });

    let [noRating, setNoRating] = useState(0);
    let [star, setStar] = useState('stars');

    // the event passed to parent event would also need to handle formErrors

    // handle rating field button group -- could do some basic arithmetic to make this cleaner (future work)
    const handleClickActivation = (event) => {
        event.preventDefault();
        let eventID = Number(event.target.id);
        setNoRating(eventID);
        eventID === 1 ? setStar('star') : setStar('stars');

        switch (eventID) {
            case 1:
                setActiveButtons({
                    ...activeButtons,
                    active1: 'active',
                    active2: 'undefined',
                    active3: 'undefined',
                    active4: 'undefined',
                    active5: 'undefined'
                });
                break;
            case 2:
                setActiveButtons({
                    ...activeButtons,
                    active1: 'active',
                    active2: 'active',
                    active3: 'undefined',
                    active4: 'undefined',
                    active5: 'undefined'
                });
                break;
            case 3:
                setActiveButtons({
                    ...activeButtons,
                    active1: 'active',
                    active2: 'active',
                    active3: 'active',
                    active4: 'undefined',
                    active5: 'undefined'
                });
                break;
            case 4:
                setActiveButtons({
                    ...activeButtons,
                    active1: 'active',
                    active2: 'active',
                    active3: 'active',
                    active4: 'active',
                    active5: 'undefined'
                });
                break;
            case 5:
                setActiveButtons({
                    ...activeButtons,
                    active1: 'active',
                    active2: 'active',
                    active3: 'active',
                    active4: 'active',
                    active5: 'active'
                });
                break;
        }
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

                <div className='noRating'>{noRating} {star}</div>
            </div>
        </div>
    );
}

export default RatingButton;
