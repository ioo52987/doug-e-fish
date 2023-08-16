import React, { useEffect, useState } from 'react';
import './Navigation.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Navigation() {

  /* */
  let MDBclasses = "list-group-item list-group-item-action py-2 ripple";
  let navigationInfo = [
    { id: 1, href: "/", icon: "fas fa-map fa-fw me-3", title: "Map" },
    { id: 2, href: "/add_fishing_trip", icon: "fas fa-plus fa-fw me-3", title: "Add Fishing Trip" },
    { id: 3, href: "/add_fishing_site", icon: "fas fa-location-arrow fa-fw me-3", title: "Add Fishing Site" },
    { id: 4, href: "/previous_trips", icon: "fas fa-arrow-left fa-fw me-3", title: "Previous Trips" },
    { id: 5, href: "/helpful_fishing_info", icon: "fas fa-info fa-fw me-3", title: "Helpful Info" },
    { id: 6, href: "/about_this_site", icon: "fas fa-heart fa-fw me-3", title: "About This Site" },
  ];

  /* states */
  let [tideData, setTideData] = useState([]);
  let [tideTimes, setTideTimes] = useState('');
  let [fishCaughtData, setFishCaughtData] = useState([]);
  let [fishCaught, setFishCaught] = useState(0);
  let [selectValue, setSelectValue] = useState("8637689");

  /* */
  let station = `8637689`;
  //var station = document.getElementById("highTide").value;
  let frontOfAPIcall = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?`;
  let endOfAPIcall = `time_zone=lst_ldt&interval=hilo&units=english&application=dougEfish&format=json`;
  let tideAPIcall = `${frontOfAPIcall}date=today&station=${station}&product=predictions&datum=MLLW&${endOfAPIcall}`;

  /* extract tide times from response data*/
  const getTideTimes = (d) => {
    let times = [];
    if (d) {
      for (let i = 0; i < d.length; i++) {
        if (d[i].type === 'H') {
          let dateTime = (d[i].t).split(" ");
          times.push(dateTime[1]);
        }
      }
      setTideTimes(times.toString());
    }
  };

  useEffect(() => {

    /* GET HIGH TIDE TIMES */
    axios.get(tideAPIcall)
      .then(response => setTideData(response.data));

    /* GET DAILY CAUGHT FISH */
    axios.get('/tblZXiWg0iGnfIucV?fields%5B%5D=fishCaught&fields%5B%5D=date')
      .then(response => setFishCaughtData(response.data));


    getTideTimes(tideData.predictions);
    getDailyFishCaught(fishCaughtData.records);
  }, []);




  /* extract daily caught fish from response data */
  const getDailyFishCaught = (d) => {
    let totalFishCaughtToday = 0;
    let currentDate = new Date().toJSON().slice(0, 10);
    if (d) {
      for (let i = 0; i < d.length; i++) {
        if (d[i].fields.date === currentDate) {
          totalFishCaughtToday = d[i].fields.fishCaughtData + totalFishCaughtToday;
        }
      }
      setFishCaught(totalFishCaughtToday);
    }
  };





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
              <li className="nav-item" id="nav-1">
                <span><i className="fas fa-fish"></i>&nbsp;Daily Fish Total:&nbsp;&nbsp;</span>
              </li>
              <li className="nav-item" id="nav-2">
                <span><i className="fas fa-water"></i>&nbsp;High Tide:&nbsp;&nbsp;</span>
              </li>
              <li className="nav-item" id="nav-3">
                <div className="input-group">
                  <select className="custom-select form-control" id="highTide">
                    <option value="8637689" defaultValue>Yorktown USCG Training Center</option>
                    <option value="8632200">Kiptopeke</option>
                    <option value="8638901">Chesapeake Channel CBBT</option>
                    <option value="8638610">Sewells Point</option>
                    <option value="8639348">Money Point</option>
                  </select>
                </div>
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



/*
function getLocalWeather{
//https://open-meteo.com/
//Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key required. Start using it now!
}
*/