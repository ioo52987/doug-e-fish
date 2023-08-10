import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Map from './page_components/Map/Map';
import AboutThisSite from './page_components/AboutThisSite/AboutThisSite';
import AddFishingTrip from './page_components/AddFishingTrip/AddFishingTrip';
import AddFishingSite from './page_components/AddFishingSite/AddFishingSite';
import PreviousTrips from './page_components/PreviousTrips/PreviousTrips';
import Photos from './page_components/Photos/Photos';
import HelpfulFishingInfo from './page_components/HelpfulFishingInfo/HelpfulFishingInfo';
import Navigation from './reusable_components/Navigation/Navigation';
import Footer from './reusable_components/Footer/Footer';

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
               {/* <Footer /> */}
            </div>
        </div>
    );
}

export default App;