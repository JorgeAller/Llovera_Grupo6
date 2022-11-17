"use strict";

/* let latitud, longitud;
navigator.geolocation.getCurrentPosition((position) => {
    
})

function succes(position){
    const latitud = position.coords.latitude;
    const longitud = position.coords.longitude;

    console.log(latitud, longitud)
}

function error(){
    alert('Lo sentimos! Posición no disponible.');
}


const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
};

const watchID = navigator.geolocation.watchPosition(succes, error, options);

 */

function getUbication() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "hola";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document.querySelector("#find-me").addEventListener("click", getUbication);
