import React from 'react';
import './Navigation.css';
import { NavLink } from 'react-router-dom';

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
                <span><i className="fas fa-fish"></i><p>Daily Fish Total:</p></span>
              </li>
              <li className="nav-item me-3 me-lg-0">
                <span><i className="fas fa-water"></i><p>High Tide:</p></span>
              </li>
            </ul>
          </div>

          {/* local NOAA weather and high and low tides for that day*/}

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

//https://open-meteo.com/
//Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key required. Start using it now!