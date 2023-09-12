import { useEffect, useState } from 'react';
import './Navigation.css';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

function Navigation() {

  let location = useLocation().pathname;
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
  let [fishCaughtData, setFishCaughtData] = useState([]);
  let [tideData, setTideData] = useState({});
  let [stationValue, setStationValue] = useState("8637689");
  let [offset, setOffset] = useState('');
  let [navToggle, setNavToggle] = useState(false);

  let currentDate = new Date().toJSON().slice(0, 10);

  useEffect(() => {

    /* build NOAA api call*/
    let frontOfAPIcall = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?`;
    let endOfAPIcall = `time_zone=lst_ldt&interval=hilo&units=english&application=dougEfish&format=json`;
    let tideAPIcall = `${frontOfAPIcall}date=today&station=${stationValue}&product=predictions&datum=MLLW&${endOfAPIcall}`;

    axios.get(`/` + process.env.REACT_APP_FISHING_TRIPS_AIRTABLE + `?fields%5B%5D=fishCaught&fields%5B%5D=date&offset=${offset}`)
      .then(response => {
        let data = response.data.records;
        setFishCaughtData(fishCaughtData => [...fishCaughtData, ...data]);
        if (response.data.offset) {
          setOffset(response.data.offset);
        }
      })
      .catch(function (error) { console.log(error); });
    axios.get(tideAPIcall)
      .then(response => setTideData(response.data))
      .catch(function (error) { console.log(error); });
  }, [stationValue, offset]);

  /* extract daily caught fish from response data */
  const getDailyFishCaught = () => {
    let totalFishCaughtToday = 0;
    if (fishCaughtData) {
      let d = fishCaughtData;
      let currentDate = new Date().toJSON().slice(0, 10);
      for (let i = 0; i < d.length; i++) {
        if (d[i].fields.date === currentDate) {
          totalFishCaughtToday = d[i].fields.fishCaught + totalFishCaughtToday;
        }
      }
    }
    return (totalFishCaughtToday);
  };

  /* extract tide times from response data*/
  const getTideTimes = () => {
    let times = [];
    if (tideData.predictions) {
      let d = tideData.predictions;
      for (let i = 0; i < d.length; i++) {
        if (d[i].type === 'H') {
          let dateTime = (d[i].t).split(" ");
          let hour = dateTime[1].split(":");
          if (hour[0] <= 11) {
            if (hour[0] === '00') {
              times.push(`12:${hour[1]}am`);
            } else {
              times.push(`${dateTime[1]}am`);
            }
          } else {
            let converted_hr = null;
            switch (hour[0]) {
              case '12':
                converted_hr = '12';
                break;
              case '13':
                converted_hr = '01';
                break;
              case '14':
                converted_hr = '02';
                break;
              case '15':
                converted_hr = '03';
                break;
              case '16':
                converted_hr = '04';
                break;
              case '17':
                converted_hr = '05';
                break;
              case '18':
                converted_hr = '06';
                break;
              case '19':
                converted_hr = '07';
                break;
              case '20':
                converted_hr = '08';
                break;
              case '21':
                converted_hr = '09';
                break;
              case '22':
                converted_hr = '10';
                break;
              case '23':
                converted_hr = '11';
                break;
              case '24':
                converted_hr = '12';
                break;
              default:
            }
            times.push(` ${converted_hr}:${hour[1]}pm`);
          }
        }
      }
      return (times.toString());
    }
  };

  const clickHandler = () => {
    var options = document.getElementById("highTide").options;
    var station = options[options.selectedIndex].id;
    setStationValue(station);
  }

  const clickHandlerSide = () => {
    var options = document.getElementById("highTide-side").options;
    var station = options[options.selectedIndex].id;
    setStationValue(station);
  }

  /* overlay functions */
  function toggleNavMenu() {
    if (navToggle === true) {
      document.getElementById("overlayMenu").style.width = "0%";
      setNavToggle(false);
    } else {
      document.getElementById("overlayMenu").style.width = "100%";
      setNavToggle(true);
    }
  }

  return (
    <div>
      <header>
        {/* SIDE NAVIGATION */}
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
          {
            location === '/about_this_site'
              ? <img id="jeriIcon" src="https://i.ibb.co/kMn501q/jeri-triangle-glasses.png" alt="jeri-the-coolest-duh" border="0" />
              : <img id="dadIcon" src="https://i.ibb.co/wRcmdxw/dad-hilton-pier.png" alt="dad-hilton-pier" border="0" />
          }
        </nav>
        <nav id="overlayMenu" className="overlay">
          <div className="overlay-content">
            <ul id='top-nav-phone' className="navbar-nav flex-column">
              <li className="nav-item" id="nav-1">
                <span><i className='fas fa-calendar'></i>&nbsp;Today's Date:&nbsp;&nbsp;{currentDate}</span>
              </li>
              <li className="nav-item" id="nav-2">
                <span><i className="fas fa-fish"></i>&nbsp;Daily Fish Total:&nbsp;&nbsp;{getDailyFishCaught()}</span>
              </li>
              <li className="nav-item" id="nav-3">
                <span><i className="fas fa-ship"></i>&nbsp;High Tide:&nbsp;&nbsp;{getTideTimes()}</span>
              </li>
              <li className="nav-item" id="nav-4">
                <div className="input-group">
                  <select className="custom-select form-control" id="highTide-side" onClick={clickHandlerSide}>
                    <option id="8637689" defaultValue>Yorktown USCG Training Center</option>
                    <option id="8632200">Kiptopeke</option>
                    <option id="8638901">Chesapeake Channel CBBT</option>
                    <option id="8638610">Sewells Point</option>
                    <option id="8639348">Money Point</option>
                  </select>
                </div>
              </li>
            </ul>
            {navigationInfo.map((val) => (
              <NavLink
                key={val.id}
                to={val.href}
                className={MDBclasses}
                onClick={toggleNavMenu}
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
            <p id='navFooter'>Have a great fishing day! </p>
          </div>
        </nav>

        {/* TOP NAVIGATION */}
        <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
          <div className="container-fluid">

            {/* TITLE AND SUBTITLE -----------------------------------------*/}
            <div id="title-computer" className="navbar-brand">
              <p id="top-title-computer">Doug-E-Fish</p>
              <p id="top-subTitle-computer">A Greater Hampton Roads Fishing Tool</p>
            </div>
            <div id="title-phone" className="navbar-brand">
              <span id="top-title-phone"><i className="fas fa-bars" onClick={toggleNavMenu}></i>&nbsp;&nbsp;Doug-E-Fish</span>
              <p id="top-subTitle-phone">A Greater Hampton Roads Fishing Tool</p>
            </div>
            {/* ------------------------------------------------*/}

            {/* RIGHT ALIGNED LINKS --------------------------- */}
            <ul id='top-nav-computer' className="navbar-nav ms-auto d-flex flex-row">
              <li className="nav-item" id="nav-1">
                <span><i className='fas fa-calendar'></i>&nbsp;Today's Date:&nbsp;&nbsp;{currentDate}</span>
              </li>
              <li className="nav-item" id="nav-2">
                <span><i className="fas fa-fish"></i>&nbsp;Daily Fish Total:&nbsp;&nbsp;{getDailyFishCaught()}</span>
              </li>
              <li className="nav-item" id="nav-3">
                <span><i className="fas fa-ship"></i>&nbsp;High Tide:&nbsp;&nbsp;{getTideTimes()}</span>
              </li>
              <li className="nav-item" id="nav-4">
                <div className="input-group">
                  <select className="custom-select form-control" id="highTide" onClick={clickHandler}>
                    <option id="8637689" defaultValue>Yorktown USCG Training Center</option>
                    <option id="8632200">Kiptopeke</option>
                    <option id="8638901">Chesapeake Channel CBBT</option>
                    <option id="8638610">Sewells Point</option>
                    <option id="8639348">Money Point</option>
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