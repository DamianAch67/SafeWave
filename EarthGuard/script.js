// let userLat;
// let userLon;
// let map;
// let userMarker;
function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,rain,weather_code`;

    fetch(url)

        .then(response => response.json())

        .then(data => {

            const current = data.current;

            document.getElementById("temperature").textContent =
                current.temperature_2m + "°C";

            document.getElementById("wind").textContent =
                current.wind_speed_10m + " km/h";

            document.getElementById("rain").textContent =
                current.rain + " mm";



            const weatherCodes = {

                0: "☀ Clear Sky",
                1: "🌤 Mainly Clear",
                2: "⛅ Partly Cloudy",
                3: "☁ Overcast",
                45: "🌫 Fog",
                48: "🌫 Fog",

                51: "🌦 Drizzle",
                53: "🌦 Moderate Drizzle",
                55: "🌧 Heavy Drizzle",

                61: "🌧 Rain",
                63: "🌧 Moderate Rain",
                65: "🌧 Heavy Rain",

                71: "❄ Snow",
                80: "🌦 Rain Showers",
                95: "⛈ Thunderstorm"

            };



            document.getElementById("condition").textContent =
                weatherCodes[current.weather_code] || "Unknown";



            const status =
                document.getElementById("storm-status");

            const warning =
                document.getElementById("storm-warning");



            if (current.wind_speed_10m > 60) {

                status.textContent = "🔴 Storm Warning";

                warning.textContent =
                    "Seek shelter immediately.";

                status.style.background =
                    "rgba(255,45,45,.15)";

                status.style.color =
                    "#ff2d2d";

            }

            else if (current.wind_speed_10m > 30) {

                status.textContent =
                    "🟡 Storm Watch";

                warning.textContent =
                    "Weather conditions may worsen.";

                status.style.background =
                    "rgba(255,170,0,.15)";

                status.style.color =
                    "#ffaa00";

            }

            else {

                status.textContent =
                    "🟢 Weather Conditions Normal";

                warning.textContent =
                    "No severe weather detected.";

                status.style.background =
                    "rgba(0,220,120,.15)";

                status.style.color =
                    "#00dc78";

            }

        });

}




navigator.geolocation.getCurrentPosition(

    (position) => {

        getWeather(

            position.coords.latitude,

            position.coords.longitude

        );

    },

    () => {

        alert("Location access denied.");

    }
);
const tsunami = {

    waveHeight: 0.6,

    coastalRisk: "Low",

    region: "Atlantic Coast",

    updated:
        new Date().toLocaleTimeString()

};


document.getElementById("wave-height").textContent =
    tsunami.waveHeight + " m";

document.getElementById("coastal-risk").textContent =
    tsunami.coastalRisk;

document.getElementById("region").textContent =
    tsunami.region;

document.getElementById("tsunami-time").textContent =
    tsunami.updated;



const tsunamiStatus =
    document.getElementById("tsunami-status");

const tsunamiMessage =
    document.getElementById("tsunami-message");



if (tsunami.waveHeight > 3) {

    tsunamiStatus.textContent =
        "🔴 Tsunami Warning";

    tsunamiStatus.style.background =
        "rgba(255,45,45,.15)";

    tsunamiStatus.style.color =
        "#ff2d2d";

    tsunamiMessage.textContent =
        "Dangerous wave activity detected. Evacuate coastal areas.";

}

else if (tsunami.waveHeight > 1.5) {

    tsunamiStatus.textContent =
        "🟡 Tsunami Watch";

    tsunamiStatus.style.background =
        "rgba(255,170,0,.15)";

    tsunamiStatus.style.color =
        "#ffaa00";

    tsunamiMessage.textContent =
        "Ocean conditions are being monitored.";

}

else {

    tsunamiStatus.textContent =
        "🟢 No Active Tsunami Warning";

    tsunamiMessage.textContent =
        "Ocean conditions are stable.";

}
async function getEarthquake() {

    const url =
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

    try {

        const response = await fetch(url);

        const data = await response.json();

        const quake = data.features[0];

        const properties = quake.properties;

        const geometry = quake.geometry;

        document.getElementById("magnitude").textContent =
            properties.mag;

        document.getElementById("quake-location").textContent =
            properties.place;

        document.getElementById("quake-depth").textContent =
            geometry.coordinates[2] + " km";

        document.getElementById("quake-time").textContent =
            new Date(properties.time).toLocaleTimeString();

        const status =
            document.getElementById("earthquake-status");

        const message =
            document.getElementById("quake-message");



        if (properties.mag >= 7) {

            status.textContent =
                "🔴 Major Earthquake";

            status.style.background =
                "rgba(255,45,45,.15)";

            status.style.color =
                "#ff2d2d";

            message.textContent =
                "Major earthquake detected. Monitor official alerts.";

        }

        else if (properties.mag >= 5) {

            status.textContent =
                "🟡 Moderate Earthquake";

            status.style.background =
                "rgba(255,170,0,.15)";

            status.style.color =
                "#ffaa00";

            message.textContent =
                "Moderate seismic activity detected.";

        }

        else {

            status.textContent =
                "🟢 Minor Seismic Activity";

            message.textContent =
                "No major earthquakes detected.";

        }

    }

    catch (error) {

        console.error(error);

    }

}

getEarthquake();

setInterval(getEarthquake, 300000);
navigator.geolocation.getCurrentPosition((position) => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    window.map = L.map('map-container').setView([lat, lon], 13);

    L.tileLayer(

        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

        {

            attribution: '© OpenStreetMap'

        }

    ).addTo(map);




    L.marker([lat, lon])

        .addTo(map)

        .bindPopup("📍 You are here.")

        .openPopup();

});
let emergencyMarkers = [];



function findPlaces(type) {


    navigator.geolocation.getCurrentPosition((position) => {


        const lat = position.coords.latitude;
        const lon = position.coords.longitude;



        const query = `

        [out:json];

        (
        node["amenity"="${type}"](around:5000,${lat},${lon});

        way["amenity"="${type}"](around:5000,${lat},${lon});

        );

        out center;

        `;



        fetch(
            "https://overpass-api.de/api/interpreter",
            {

                method: "POST",

                body: query

            })

            .then(response => response.json())

            .then(data => {


                // remove old markers

                emergencyMarkers.forEach(marker => {

                    map.removeLayer(marker);

                });


                emergencyMarkers = [];



                data.elements.forEach(place => {


                    let placeLat =
                        place.lat || place.center.lat;


                    let placeLon =
                        place.lon || place.center.lon;



                    let name =
                        place.tags.name ||
                        "Emergency Service";



                    let marker =
                        L.marker(
                            [placeLat, placeLon]
                        )

                            .addTo(map)

                            .bindPopup(`

🚨 <b>${name}</b>
<br>
Type: ${type}

<br><br>

<a href="https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLon}" target="_blank">

🗺 Start Navigation

</a>

`);



                    emergencyMarkers.push(marker);



                });


            });


    });


}
function getNearestPlace(type) {

    navigator.geolocation.getCurrentPosition((position) => {


        const lat = position.coords.latitude;
        const lon = position.coords.longitude;


        const query = `

        [out:json];

        (
        node["amenity"="${type}"](around:10000,${lat},${lon});

        way["amenity"="${type}"](around:10000,${lat},${lon});

        );

        out center;

        `;



        fetch(
            "https://overpass-api.de/api/interpreter",
            {

                method: "POST",

                body: query

            })


            .then(response => response.json())


            .then(data => {


                if (data.elements.length === 0) {

                    alert(
                        "No nearby emergency service found."
                    );

                    return;

                }



                let nearest = data.elements[0];



                let placeLat =
                    nearest.lat ||
                    nearest.center.lat;


                let placeLon =
                    nearest.lon ||
                    nearest.center.lon;



                let name =
                    nearest.tags.name ||
                    "Emergency Service";



                // Open Google Maps directions

                const mapsURL =

                    `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${placeLat},${placeLon}`;

                L.marker([placeLat, placeLon])
                    .addTo(map)
                    .bindPopup(`

🚨 <b>${name}</b>

<br>

📍 Nearest ${type}

<br><br>

<a href="${mapsURL}" target="_blank">

🗺 Start Navigation

</a>

`)
                    .openPopup();


                map.setView(
                    [placeLat, placeLon],
                    15
                );


            });


    });


}
function loadEmergencyNumbers(country){


    let emergency = {


        "Ghana": {

            police:"191",
            fire:"192",
            ambulance:"193"

        },


        "United States": {

            police:"911",
            fire:"911",
            ambulance:"911"

        },


        "Japan": {

            police:"110",
            fire:"119",
            ambulance:"119"

        },


        "United Kingdom": {

            police:"999",
            fire:"999",
            ambulance:"999"

        }


    };



    let data =
    emergency[country] ||
    {

        police:"112",
        fire:"112",
        ambulance:"112"

    };



    document.getElementById("police-number")
    .textContent=data.police;


    document.getElementById("fire-number")
    .textContent=data.fire;


    document.getElementById("ambulance-number")
    .textContent=data.ambulance;



    document.getElementById("police-call")
    .href="tel:"+data.police;


    document.getElementById("fire-call")
    .href="tel:"+data.fire;


    document.getElementById("ambulance-call")
    .href="tel:"+data.ambulance;


}
navigator.geolocation.getCurrentPosition((position)=>{


fetch(
`https://ipapi.co/json/`
)

.then(response=>response.json())

.then(data=>{


    loadEmergencyNumbers(
        data.country_name
    );


});


});