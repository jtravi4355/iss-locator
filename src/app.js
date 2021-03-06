var mapboxgl = require('mapbox-gl');
const latBox = document.querySelector(".lat");
const lonBox = document.querySelector(".lon");
const nextPass = document.getElementById("up-next");
const zip = document.getElementById("zip");
const submitBtn = document.getElementById("submitBtn");

const getPosition = async () => {

    const res = await fetch(`http://api.open-notify.org/iss-now.json`);
    const data = await res.json();
    console.log(data.iss_position.latitude);
    console.log(data.iss_position.longitude);
    let lon = data.iss_position.longitude;
    let lat = data.iss_position.latitude;
    latBox.innerHTML = `Lat: ${lat}`;
    lonBox.innerHTML = `Lon : ${lon}`;
    renderMap(lon, lat);
};

getPosition();
window.setInterval(getPosition, 300000);

const renderMap = (lon, lat) => {
    mapboxgl.accessToken =
        "pk.eyJ1IjoianJ0cmF2aTQzIiwiYSI6ImNrY2UzaTg1OTA0bjcycnFyOWY2Z3B6emwifQ.EP6k-841HVoMCKVCEdS7xA";
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [lon, lat], // starting position [lng, lat]
        zoom: 2, // starting zoom
    });

    var marker = new mapboxgl.Marker().setLngLat([lon, lat]).addTo(map);
};

const howClose = async (lon, lat) => {
    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    const res = await fetch(`${proxyURL}http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`,

    );
    const data = await res.json();
    // console.log(data.response[0].risetime);
    // console.log(data.response[0].duration);
    output = "";
    data.response.forEach(d => {
        let date = new Date(d["risetime"] * 1000).toString();
        console.log(date);
        let stripDate = date.replace('GMT-0400', '');
        console.log(stripDate);
        output += `<li>${stripDate}</li>`;
    });

    nextPass.innerHTML = `${output}`;
};

submitBtn.addEventListener("click", e => {
    e.preventDefault();
    console.log(zip.value);
    zipToPosition(zip.value);
});

const zipToPosition = async zip => {
    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    const apiKey =
        "ZUJjUucUvcz9NwGBOrwdwazFCp7WJKGMj2Ow9IDH2NUXCPzVVsREDUnnp3L1RX20";
    const res = await fetch(
        `${proxyURL}https://www.zipcodeapi.com/rest/${apiKey}/info.json/${zip}/degrees`
    );
    const data = await res.json();

    console.log(data.lat, data.lng);
    howClose(data.lng, data.lat);
};

