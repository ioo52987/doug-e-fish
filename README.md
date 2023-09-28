# :fish: Doug-E-Fish


<p id='pageTitle'>Welcome!</p>
This is a web app created for people who like to fish in the Greater Hampton Roads Area.
My hope is that it is used and enjoyed by everyone who loves all things fishing! <i>Enjoy!</i>


#### Design and Architecture
Doug-E-Fish is a serverless app with full CRUD operations. 
If functionality increases, the next app version will be to swap out
Airtable with an actual database. We've already maxed out Airtable functionality without spending
copious amounts of time studying their software. Workflow Management Software and CRMs (in my opinion) are becoming more
trouble than they are worth, because of their large learning curve. Also, the reliance on 3rd party software can be somewhat risky and
in the long run more costly. Rapid changes in technology require that more people know how to code (seems obvious). Intermediary software 
solutions (though well intended) cripple this avenue. Learn coding! It's fun and empowering!

Powered by the following techonologies: \
\
[![My Skills](https://skills.thijs.gg/icons?i=react,js,html,css,bootstrap,nodejs)](https://skills.thijs.gg)
Technologies used.
React, Mapbox, emailJS, Bootstrap, Font Awesome, NOAA API, Axios, Airtable,
nodeJS, npm, Javascript
 \
(Font Awesome, NOAA API,Hash Router)

## Functionality and Component Overview
#### Navigation 
The top banner displays the current date, total fish caught for the current date, and the high tide times for each of the 5 NOAA stations within the Hampton Roads Area. The user can select a NOAA station with a dropdown menu. <br>
![banner](https://i.ibb.co/NYM537y/banner.png)
The sidebar menu navigates the user between components. <br>
![nav](https://i.ibb.co/Pr4L0MF/nav.png)

#### Map
The Map component integrates Mapbox's api. There are two icon types: a fish and a life float. <br>
![map](https://i.ibb.co/RcVqLxd/icons.png) <br>
A fish icon represents an fishing site. When mousing over the icon, a popup box emerges with information about the site name, the overall rating of the site, the number of fish caught at that site on the current date, and a description of the fishing site. <br>
![fishSite-popup](https://i.ibb.co/DDTWmpj/fs-pop.png) <br>
A life float icon represents and NOAA station. When mousing over the icon, a popup box emerges with the name of the station and the station number.
Depending on where the user decides to fish they can see where the nearest NOAA station is and gather data pertinent to their trip. <br>
![station-popup](https://i.ibb.co/WWZd5Jp/station-pop.png) <br>

#### Add Fishing Trip
A user has the ablity to enter in their fishing trip.
![ft-form](https://i.ibb.co/vXPYcLv/ft-form.png) <br>

#### Add Fishing Site
A user has the ability to enter new fishing sites to the map. The can give the site a name and indicate whether it is tidal or not. To add the site they will also have to provide coordinates. The app will restrict the coordinates range, so that only coordinates in the Hampton Roads area may be entered. Each coordiante will also require at least 5 decimal points for specificity. A description of the site is also necessary. All fields EXCEPT the url field are required. All fields have custom client-side field validation. <br>
![fs-form](https://i.ibb.co/JtzxKwB/fs-form.png) <br>

#### Previous Trips
#### Helpful Info
#### About This Site
