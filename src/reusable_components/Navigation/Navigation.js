import React, { useState } from 'react';
import './Navigation.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Navigation() {

  let MDBclasses = "list-group-item list-group-item-action py-2 ripple";
  let navigationInfo = [
    { id: 1, href: "/", icon: "fas fa-map fa-fw me-3", title: "Map" },
    { id: 2, href: "/add_fishing_trip", icon: "fas fa-plus fa-fw me-3", title: "Add Fishing Trip" },
    { id: 3, href: "/add_fishing_site", icon: "fas fa-location-arrow fa-fw me-3", title: "Add Fishing Site" },
    { id: 4, href: "/previous_trips", icon: "fas fa-arrow-left fa-fw me-3", title: "Previous Trips" },
    /* { id: 5, href: "/photos", icon: "fas fa-camera fa-fw me-3", title: "Photos" },*/
    { id: 6, href: "/helpful_fishing_info", icon: "fas fa-info fa-fw me-3", title: "Helpful Info" },
    { id: 7, href: "/about_this_site", icon: "fas fa-heart fa-fw me-3", title: "About This Site" },
  ];

  return (
    <div>
      {/* HEADER */}
      <header>
        {/* SIDEBAR */}
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
          <div className="position-sticky">
            <div className="list-group list-group-flush mx-3 mt-4">

              {navigationInfo.map((val) => (
                <NavLink
                  key={val.id}
                  to={val.href}
                  className={MDBclasses}
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: '#000000',
                        textDecoration: 'none',
                        background: '#fbfbfb',
                        borderColor: '#fbfbfb',
                      }
                      : {
                        color: '#fbfbfb',
                        textDecoration: 'none',
                      }
                  }><i className={val.icon}></i><span>{val.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
          <img id="dadIcon" src="https://i.ibb.co/wRcmdxw/dad-hilton-pier.png" alt="dad-hilton-pier" border="0" />
        </nav>

        {/* NAVBAR */}
        <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
          <div className="container-fluid">

            {/* TOGGLE BUTTON -- comeback to and look into for mobile design*/}

            {/* BRAND */}
            <div className="navbar-brand">
              <p id="title">Doug-E-Fish</p>
              <p id="subTitle">A Greater Hampton Roads Fishing Tool</p>
            </div>

            {/* RIGHT ALIGNED LINKS */}
            <ul className="navbar-nav ms-auto d-flex flex-row">
              <li className="nav-item me-3 me-lg-0">
                <span><i className="fas fa-fish"></i><p>Daily Fish Total:&nbsp;&nbsp;{getFishCaughtToday()}</p></span>
              </li>
              <li className="nav-item me-3 me-lg-0">
                <span><i className="fas fa-water"></i>
                  <div class="input-group mb-3">
                    <select class="custom-select form-control" onchange="getTideData(this.value);">
                      <p>High Tide:{getTideData()}</p>
                      <option value="8637689" selected>Yorktown USCG Training Center</option>
                      <option value="8632200">Kiptopeke</option>
                      <option value="8638901">Chesapeake Channel CBBT</option>
                      <option value="8638610">Sewells Point</option>
                      <option value="8639348">Money Point</option>
                    </select>
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ marginTop: 58 + 'px' }}>
        <div className="container pt-4"></div>
      </main>
    </div >
  );
}

export default Navigation;





function getFishCaughtToday() {

  let totalFishCaughtToday = 0;
  let [data, setData] = useState([]);
  let recordsArr = [];
  let currentDate = new Date().toJSON().slice(0, 10);

  axios.get('/tblZXiWg0iGnfIucV?fields%5B%5D=fishCaught&fields%5B%5D=date')
    .then(response => setData(response.data));

  if (data.records) {
    recordsArr = data.records;
  }

  for (let i = 0; i < recordsArr.length; i++) {
    if (recordsArr[i].fields.date === currentDate) {
      totalFishCaughtToday = recordsArr[i].fields.fishCaught + totalFishCaughtToday;
    }
  }

  return (totalFishCaughtToday);
}

function getTideData(station) {

  let stationNo = `8637689`;
  let frontOfAPIcall = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?`;
  let endOfAPIcall = `time_zone=lst_ldt&interval=hilo&units=english&application=dougEfish&format=json`;
  let tideAPIcall = `${frontOfAPIcall}date=today&station=${station}&product=predictions&datum=MLLW&${endOfAPIcall}`;
  let [tideData, setTideData] = useState([]);
  let recordsArr = [];

  axios.get(tideAPIcall)
    .then(response => setTideData(response.data));

  if (tideData.predictions) {
    recordsArr = tideData.predictions;
  }

  let time = '';
  for (let i = 0; i < recordsArr.length; i++) {
    if (recordsArr[i].type === 'H') {
      time = recordsArr[i].t;
      break;
    }
  }
  return (time);
}



/*
function getLocalWeather{
//https://open-meteo.com/
//Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key required. Start using it now!
}
*/