import React from 'react';
import './Navigation.css';
import { NavLink } from "react-router-dom";

function Navigation() {

  return (
    <div className="Navigation">
      <nav>
        <ul id="navigation">

        <li className='hoverStyle'><NavLink
            to="/"
            style={({ isActive }) =>
              isActive
                ? {
                  color: '#000000',
                  textDecoration: 'none',
                  background: '#70d3a9',
                  padding: '8px',
                  borderRadius: '0.375rem',
                }
                : { 
                  color: '#000000',
                  textDecoration: 'none',
                }
            }>Map</NavLink>
          </li>

        <li className='hoverStyle'><NavLink
            to="/add_fishing_trip"
            style={({ isActive }) =>
              isActive
                ? {
                  color: '#000000',
                  textDecoration: 'none',
                  background: '#70d3a9',
                  padding: '8px',
                  borderRadius: '0.375rem',
                }
                : { 
                  color: '#000000',
                  textDecoration: 'none',
                }
            }>Add Fishing Trip</NavLink>
          </li>

          <li className='hoverStyle'><NavLink
            to="/add_fishing_site"
            style={({ isActive }) =>
              isActive
                ? {
                  color: '#000000',
                  textDecoration: 'none',
                  background: '#70d3a9',
                  padding: '8px',
                  borderRadius: '0.375rem',
                }
                : { 
                  color: '#000000',
                  textDecoration: 'none',
                }
            }>Add Fishing Site</NavLink>
          </li>

          <li className='hoverStyle'><NavLink
            to="/previous_trips"
            style={({ isActive }) =>
              isActive
                ? {
                  color: '#000000',
                  textDecoration: 'none',
                  background: '#70d3a9',
                  padding: '8px',
                  borderRadius: '0.375rem',
                }
                : { 
                  color: '#000000',
                  textDecoration: 'none',
                }
            }>Previous Trips</NavLink>
          </li>

          <li className='hoverStyle'><NavLink
            to="/photos"
            style={({ isActive }) =>
              isActive
                ? {
                  color: '#000000',
                  textDecoration: 'none',
                  background: '#70d3a9',
                  padding: '8px',
                  borderRadius: '0.375rem',
                }
                : { 
                  color: '#000000',
                  textDecoration: 'none',
                }
            }>Photos</NavLink>
          </li>

          <li className='hoverStyle'><NavLink
            to="/helpful_info"
            style={({ isActive }) =>
              isActive
                ? {
                  color: '#000000',
                  textDecoration: 'none',
                  background: '#70d3a9',
                  padding: '8px',
                  borderRadius: '0.375rem',
                }
                : { 
                    color: '#000000',
                    textDecoration: 'none',
                  }
            }>Helpful Info</NavLink>
          </li>

        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
