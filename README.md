# :fish: Doug-E-Fish

<p id='pageTitle'>Welcome!</p>
This is a web app created for people who like to fish in the Greater Hampton Roads Area. <br>
I hope that it is used and enjoyed by everyone who loves all things fishing! <br>
<i>Enjoy!</i> <br><br> https://www.doug-e-fish.com <br>

***

### Design and Architecture
Doug-E-Fish is a serverless React app with full CRUD operations. <br>
If app complexity increases, the next version will need to swap out Airtable with an actual database. 

Powered by the following technologies: \
\
[![My Skills](https://skills.thijs.gg/icons?i=react,js,html,css,bootstrap,nodejs)](https://skills.thijs.gg) <br>
 \
In Addition:  Mapbox, emailJS, Font Awesome, NOAA's API, Axios, Airtable, npm, Hash Router <br>

***

### Functionality and Component Overview
#### Navigation 
The top banner displays the current date, total fish caught for the current date, and the high tide times for each of the 5 NOAA stations within the Hampton Roads Area. The user can select a NOAA station with a dropdown menu. <br>
![banner](https://i.ibb.co/NYM537y/banner.png)
The sidebar menu navigates the user between components. <br>
![nav](https://i.ibb.co/Pr4L0MF/nav.png)

#### Map
The Map component integrates Mapbox's API. There are two icon types: a fish and a life float. <br>
![map](https://i.ibb.co/RcVqLxd/icons.png) <br>
A fish icon represents a fishing site. When mousing over the icon, a popup box emerges with information about the site name, the overall rating of the site, the number of fish caught at that site on the current date, and a description of the fishing site. <br>
![fishSite-popup](https://i.ibb.co/DDTWmpj/fs-pop.png) <br>
A life float icon represents a NOAA station. When mousing over the icon, a popup box emerges with the name of the station and the station number.
Depending on where the user decides to fish they can see where the nearest NOAA station is and gather data pertinent to their trip. <br>
![station-popup](https://i.ibb.co/WWZd5Jp/station-pop.png) <br>

#### Add Fishing Trip
Here a user can enter their fishing trip. This form has fields date, fishing site (a dropdown), tidal info (high, low, ebb, na), how many fish they caught on their trip, a brief description of their trip, and the option to enter in a url to a public external photo album. All fields EXCEPT the url field are required. All fields have custom client-side validation. <br>
![ft-form](https://i.ibb.co/y4ySNgB/ft-form.png) <br>

#### Add Fishing Site
Here a user can enter new fishing sites into the map. They can give the site a name and indicate whether it is tidal or not. To add the site they will also have to provide coordinates. The app will restrict the coordinates range so that only coordinates in the Hampton Roads area may be entered. Each coordinate will also require at least 5 decimal points for specificity. A description of the site is also necessary. All fields EXCEPT the url field are required. All fields have custom client-side field validation. <br>
![fs-form](https://i.ibb.co/fFC82z1/fs-form.png) <br>

#### Previous Trips
This table is powered by MDB. Each column is sortable by the type of data in the column. Here a user can see other trips other users took and information that might help them be successful in their fishing.
![pt-table](https://i.ibb.co/nMw2Gb8/pt-table.png) <br>

#### Helpful Info
Give the user the ability to select a date in conjunction with a NOAA station and receive high tide times. The table is built with MDB tables. <br>

***

### Caveats
Currently, there are no db scripts to help with the proper deleting or adding of trips and sites. If a trip is deleted in Airtable (as it is currently written) the tripTotal and rSum do not decrease with the values deleted. They persist. Also, if you enter in new trip, since the client-side logic will not be hit, the data has the potential to lose cleanliness by missing all the custom validation code. In addition, tripTotal will not increment and rSum won't sum to create a new overallRating.

This app quickly became much more comprehensive than originally intended. I thought about hooking it up to a proper backend, but since my dad will be managing the site, Airtable seemed to be the best user-friendly solution. If this app takes on any more complexity it will need to be hooked up to a real db. (most likely mySQL)
