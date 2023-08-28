import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Map from './page_components/Map/Map.js';
import AboutThisSite from './page_components/AboutThisSite/AboutThisSite.js';
import AddFishingTrip from './page_components/AddFishingTrip/AddFishingTrip.js';
import AddFishingSite from './page_components/AddFishingSite/AddFishingSite.js';
import PreviousTrips from './page_components/PreviousTrips/PreviousTrips.js';
import Photos from './page_components/Photos/Photos.js';
import HelpfulFishingInfo from './page_components/HelpfulFishingInfo/HelpfulFishingInfo.js';
import Navigation from './reusable_components/Navigation/Navigation.js';

function App() {
    return (
        <div>
            <Navigation />
            <div id='pageContainer'>
                <Routes>
                    <Route path="/" element={<Map />} />
                    <Route path="/about_this_site" element={<AboutThisSite />} />
                    <Route path="/add_fishing_site" element={<AddFishingSite />} />
                    <Route path="/add_fishing_trip" element={<AddFishingTrip />} />
                    <Route path="/helpful_fishing_info" element={<HelpfulFishingInfo />} />
                    <Route path="/photos" element={<Photos />} />
                    <Route path="/previous_trips" element={<PreviousTrips />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;