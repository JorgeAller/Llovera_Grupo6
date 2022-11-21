"use strict";
import State, { toggleMode /* saveInfo */ } from "./state.js";
console.log(State);

const ulElement = document.querySelector("ul");
const ulCurrent = document.createElement("ul");
ulCurrent.classList.toggle("ulActualGrandeCentro");
ulCurrent.classList.toggle("quitar");
const liTiempoAct = document.createElement("li");
liTiempoAct.classList.toggle("liActualGrandeCentro");
const h2Llueve = document.querySelector("#lloveraTitle");
const h2NoLlueve = document.querySelector("#noLloveraTitle");

let latitude;
let longitude;
let horaActual;
let date;
let intervalHora;
let imgWeatherActual;
let descWeatherAct;
let llueve = false;
let llovera;

let arrayLis = [];
let liTiempoArray = [];

/* const localStoragePrueba = {
  lati: 0,
  longi: 0,
  horaActualSto: 0,
}; */

async function getTiempo(url) {
  try {
    let response = await fetch(url);
    /* --- DESCOMENTAR ESTO PARA VER EL OBJETO response  ----
    console.log(response);*/

    if (response.ok === false) {
      throw new Error(`${response.status}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("MiError:", error.message);
  } finally {
  }
  return null;
}

async function main(lat, long, hora) {
  arrayLis = [];
  let urlTiempo = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=minutely,daily,alerts&units=metric&appid=908b7c8d6bc66810507e48c1a1e46436&lang=es`;
  let data = await getTiempo(urlTiempo);
  console.log("INFO DEL OBJETO DATA DE LA API", data);

  // DECLARADO ANTES PARA NADA MAS CLICKAR TE SALGA UNA HORA EN VEZ DEL HUECO VACIO
  const parrafoHoraActual = document.querySelector("#horaActual");
  date = new Date(hora);
  parrafoHoraActual.textContent = date.toLocaleString(`en-GB`);
  console.log(date);

  //
  //
  // INTERVAL PARA QUE A CADA SEGUNDO ACTUALICE LA HORA QUE ES
  intervalHora = setInterval(() => {
    hora = hora + 1000; //Le sumo 1000 porque timestamp nos da el tiempo en milisegundos desde el 1 enero de 1970 bla bla bla
    date = new Date(hora);
    parrafoHoraActual.textContent = date.toLocaleString(`en-GB`);
  }, 1000);

  //
  //
  // Llamamos a la funcion que hicimos en clase que nos devolvía la ciudad, con los parametros lat y long que coge de nuestra ubicación
  // Ya miraremos como hacer lo de cambiar, que de momento lo veo demasiado lioso tal y como lo tenemos.

  let addresFinal = await addres(lat, long);
  const addresActual = document.querySelector("#addresActual");
  addresActual.textContent = addresFinal; // Y aquí metemos el texto de la ciudad que sea en un p nuevo vacio que cree para meter esta info.

  //
  //
  //
  if (data !== null) {
    const fragment = document.createDocumentFragment();
    const fragment2 = document.createDocumentFragment();
    const main = document.querySelector("main");
    let tiempoActual = [];
    tiempoActual[0] = data.current;
    // console.log(tiempoActual[0]);

    let temperaturaAct = Math.round(tiempoActual[0].temp); // Redondee el número porque poner los decimales de la temp no lo veia muy util. Si queremos que salga solo hay que quitar el math
    //console.log("Temperatura actual", temperaturaAct);

    const pTemperaturaAct = document.createElement("p");
    pTemperaturaAct.textContent = temperaturaAct + "ºC";

    let fechaAct = tiempoActual[0].dt;
    const pDatosFechaAct = document.createElement("p");
    pDatosFechaAct.textContent = timeConverter(fechaAct);

    let objectWeather = tiempoActual[0].weather;
    //console.log("hola tiempo actual", objectWeather);

    for (let a of objectWeather) {
      //console.log(a);
      let dataMainAct = a.main;
      let dataDescAct = a.description;

      let dataIconAct = a.icon;
      //console.log("hola", dataIconAct);

      const pDatosLluviaMainAct = document.createElement("p");
      pDatosLluviaMainAct.textContent = dataMainAct;

      // %%%%%%%%%%%%% ESTO ES PARA EL TIEMPO ACTUAL, PARA PONER EN GRANDE %%%%%%%%%%%%%%

      if (dataIconAct === "01d" || dataIconAct === "01n") {
        //Sol
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Sol.png`);
        //
      } else if (dataIconAct === "02d" || dataIconAct === "02n") {
        //Nubes con algo de sol
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Soleado.png`);
        //
      } else if (dataIconAct === "03d" || dataIconAct === "03n") {
        //Nubes también. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Nublado.png`);
        //
      } else if (dataIconAct === "04d" || dataIconAct === "04n") {
        //Nubes también. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Nublado.png`);
        //
      } else if (dataIconAct === "09d" || dataIconAct === "09n") {
        //Los diferentes tipos de LLUVIA INTENSA que haya
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Lluvia.png`);
        //
      } else if (dataIconAct === "10d" || dataIconAct === "10n") {
        //Los diferentes tipos de LLUVIA SUAVE que haya
        // -----------------------------------------------------BUSCAR UN ICONO PARA LLUVIA LIGERA ---------------------------------------------------
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Lluvia.png`);
        //
      } else if (dataIconAct === "11d" || dataIconAct === "11n") {
        //Tormenta
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Tormenta.png`);
        //
      } else if (dataIconAct === "13d" || dataIconAct === "13n") {
        //Los diferentes tipos de nieve  que haya (OJALA NIEVE EN CORUÑA XD)
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Nieve.png`);
        //
      }
      descWeatherAct = document.createElement("p");
      descWeatherAct.classList.toggle("fraseDesc");
      descWeatherAct.textContent = mayusFistLetter(dataDescAct);
      liTiempoAct.append(pTemperaturaAct);
      /* liTiempoAct.append(pDatosFechaAct); */
      liTiempoAct.append(descWeatherAct);
      liTiempoAct.append(imgWeatherActual);

      fragment2.append(liTiempoAct);
    }
    ulCurrent.prepend(fragment2);
    main.prepend(ulCurrent);

    //
    //

    let horas = data.hourly;
    let horasOnly8 = horas.slice(1, 9);
    let i = 0;

    /*----- DESCOMENTO ESTO PARA VER EL ARRAY CON LA PREDICCION DE LAS PROXIMAS 8 HORAS QUE DEVUELVE LA API-------*/
    // console.log(horasOnly8);

    for (let tiempo of horasOnly8) {
      let temperatura = Math.round(tiempo.temp); // Redondee el número porque poner los decimales de la temp no lo veia muy util. Si queremos que salga solo hay que quitar el math

      const pTemperatura = document.createElement("p");
      pTemperatura.textContent = temperatura + "º";

      let fecha = tiempo.dt;
      const pDatosFecha = document.createElement("p");
      pDatosFecha.textContent = timeConverter(fecha);

      let objectWeather = tiempo.weather;

      /*  ------DESCOMENTA ESTO PARA VER EL ARRAY DE CADA HORA DE LA PREDICCIÓN Y VER QUE DEUELVE LA API.*/
      // console.log(objectWeather);

      const liTiempo = document.createElement("li");

      for (let dato of objectWeather) {
        let dataMain = dato.main;
        let dataDesc = dato.description;
        let dataIcon = dato.icon;

        const pDatosLluviaMain = document.createElement("p");
        pDatosLluviaMain.textContent = dataMain;

        // variable para poner el png de los diferentes tipos de descripciones de tiempo
        let imgWeather;
        let descWeather;

        // A cada descripción le asignmaos el icono que nos da la api con el codigo que viene includo en el array
        // Luego si queremos poner nuestros iconos habria que hacerlo con if else (como está comentado despues, cambiando los enlaces por nuestros iconos)
        // Hay dos iconos para probar, habria que buscar una familia entera de ellos. Si descomentas el if de lluvia de gran intensidad se puede ver
        /* imgWeather = document.createElement("img");
        imgWeather.setAttribute(
          "src",
          `http://openweathermap.org/img/wn/${dataIcon}@4x.png`
        ); */

        // Según la página de la api, asignamos a cada Descripción el icono corresponie

        if (dataIcon === "01d" || dataIcon === "01n") {
          //Sol
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_sol");
          imgWeather.setAttribute("src", `./img/Sol.png`);
          //
        } else if (dataIcon === "02d" || dataIcon === "02n") {
          //Nubes con algo de sol
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_nubes");
          imgWeather.setAttribute("src", `./img/Soleado.png`);
          //
        } else if (dataIcon === "03d" || dataIcon === "03n") {
          //Nubes también. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_nubes");
          imgWeather.setAttribute("src", `./img/Nublado.png`);
          //
        } else if (dataIcon === "04d" || dataIcon === "04n") {
          //Nubes también. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_nubes");
          imgWeather.setAttribute("src", `./img/Nublado.png`);
          //
        } else if (dataIcon === "09d" || dataIcon === "09n") {
          //Los diferentes tipos de LLUVIA INTENSA que haya
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_lluvia_intensa");
          imgWeather.setAttribute("src", `./img/Lluvia.png`);
          //
        } else if (dataIcon === "10d" || dataIcon === "10n") {
          //Los diferentes tipos de LLUVIA SUAVE que haya
          // -----------------------------------------------------BUSCAR UN ICONO PARA LLUVIA LIGERA ---------------------------------------------------
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_lluvia");
          imgWeather.setAttribute("src", `./img/Lluvia.png`);
          //
        } else if (dataIcon === "11d" || dataIcon === "11n") {
          //Tormenta
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_tormenta");
          imgWeather.setAttribute("src", `./img/Tormenta.png`);
          //
        } else if (dataIcon === "13d" || dataIcon === "13n") {
          //Los diferentes tipos de nieve  que haya (OJALA NIEVE EN CORUÑA XD)
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_nieve");
          imgWeather.setAttribute("src", `./img/Nieve.png`);
          //
        }

        descWeather = document.createElement("p");
        descWeather.textContent = mayusFistLetter(dataDesc);

        //
        //
        // Al li que cree antes del 2º for (anidado), le metemos (append) todos los datos que necesitamos en cada hora del pronóstico
        liTiempo.append(pTemperatura);
        liTiempo.append(pDatosFecha);
        /* liTiempo.append(pDatosLluviaMain); */
        liTiempo.append(imgWeather);
        liTiempo.append(descWeather);

        const stringMain = pDatosLluviaMain.innerHTML;

        arrayLis.push(stringMain);

        /* liTiempo.append(descWeather); */
        //
        //
        liTiempo.setAttribute("id", i++);

        //
        // Y al fragment que creamos antes de entrar al 1º for, le metemos (append) esa info en un solo bloque para luego meterla toda junta en vez de por partes

        fragment.append(liTiempo);
      }
    }
    //
    //
    // Y una vez salimos de los bucles, al ul creado al principio del codigo, le metemos (append) ese fragment.
    // Así imprimimos en pantalla todas las fichas del carrusel en un solo bloque en vez de ir imprimiendo una a una
    ulElement.append(fragment);
  }
  if (arrayLis.includes("Rain")) {
    h2Llueve.classList.remove("quitar");
    // bodyElement.classList.add("gotasLluvia");
  } else {
    h2NoLlueve.classList.remove("quitar");
  }
}

/* function aVerSiLLueve() {
 
} */
function getUbication() {
  ulElement.innerHTML = "";
  const status = document.querySelector("#status");

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    horaActual = position.timestamp;

    /* date = new Date(horaActual); */

    /* --- DESCOMENTAR ESTO PARA VER EL OBJETO GeolocationPosition ----*/
    // let hola = position;
    // console.log(hola);

    /*  status.style.display = none; */
    main(latitude, longitude, horaActual);
  }

  function error() {
    status.textContent = "No se pudo obtener su localización";
  }

  if (!navigator.geolocation) {
    status.textContent =
      "La geolocaliozación no es compatible con su navegador";
  } else {
    /* status.textContent = "Localizando…"; */
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

/* document.querySelector("#mainButton").addEventListener("click", getUbication); */

function timeConverter(UNIXtimestamp) {
  const a = new Date(UNIXtimestamp * 1000);
  // const months = [
  //   "Jan",
  //   "Feb",
  //   "Mar",
  //   "Apr",
  //   "May",
  //   "Jun",
  //   "Jul",
  //   "Aug",
  //   "Sep",
  //   "Oct",
  //   "Nov",
  //   "Dec",
  // ];
  // const year = a.getFullYear();
  // const month = months[a.getMonth()];
  // const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  // Utilizamos la funcion de mirar la longitud del numero, para formatear bien la fecha. Si getLength es 0 o 1, añade un 0 delante del numero
  const time =
    (getLength(hour) <= 1 ? "0" + hour : hour) +
    ":" +
    (getLength(min) <= 1 ? "0" + min : min); /* +
    (getLength(sec) <= 1 ? "0" + sec : sec); */
  return time;
}

//

async function addres(lat, long) {
  try {
    // Le cambié las data1,2,3 por algo más descriptivo. Y además lo metí todo en el TryCatch por si acaso hay algun fallo al meter las coordenadas
    let urlAddres = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyC-YIx41jIe2-fnoVGCoD74UAOmJJAhPtY`;
    let dataAddres = await getTiempo(urlAddres);

    if (dataAddres.status !== "OK") {
      throw new Error(`${response.status}`);
    }
    let aVerQuePasa = [];
    let addresWithCode = dataAddres.results;
    console.log(addresWithCode);
    for (let hola of addresWithCode) {
      if (
        hola.address_components.length === 4 ||
        hola.address_components.length === 3 ||
        hola.address_components.length === 2 ||
        hola.address_components.length === 1
      ) {
        aVerQuePasa.push(hola);
        let direccion = aVerQuePasa[0].formatted_address;
        return direccion;
      }
    }

    /* for (let name of addresWithCode.results) */

    //Resulta que el código del inicio siempre tiene 9 dígitos XXXX+XXX (inlcuido el espacio de despues).
    //Por lo tanto nos vale con sacar una string desde la posición 9 hasta el final de la string original
    /* let addresFinal = addresWithCode.substring(9, addresWithCode.length);

    return addresFinal; */
  } catch (error) {
    let direccion = "ERROR AL OBTENER LA UBICACIÓN";
    console.error("Error en la ubicación. No se pudo obtener la Dirección");
    return direccion;
  } finally {
  }
  return null;
}

//Función para mirar la cantidad de cifras de un numero (para arreglar la hora)
function getLength(number) {
  return number.toString().length;
  //
  //
  //
}

// Función para poner la primer letra mayuscula de cada string que le pasemos
// Util porque cada descripción del tiempo que nos da la API nos la da toda en minúsculas
function mayusFistLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
//
//
//
//

const bodyElement = document.querySelector("body");
const modeButton = document.querySelector("#night");
const lupita = document.querySelector(".lupa");
modeButton.addEventListener("click", () => {
  // quito/pongo modalidad noche
  bodyElement.classList.toggle("noche");
  lupita.classList.toggle("noche");
  toggleMode();
});
if (State.nigth === true) {
  // cuando abro la página o hago F5 pongo la clase noche si State.nigth === true
  bodyElement.classList.add("noche");
}

// Declaradas todas las const que necesitamos para quitar y poner desde el menu inicio o desde la pantalla de informacion
const buttonLlovera = document.querySelector("#mainButton");
let buttonMenuBurger = document.querySelector("#menuGoBack");
const pAddressActual = document.querySelector("#addresActual");
const pHoraActual = document.querySelector("#horaActual");
const fraseDesc8Horas = document.querySelector("#frase");
const button = document.querySelectorAll("button");
const carrusel = document.querySelector("#last");
const header = document.querySelector("header");
const formCiudad = document.querySelector("form");
const formElement = document.forms.ciudad;
const h1Element = document.querySelector("#mainTitle");

// console.log(formElement);

//

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  liTiempoAct.innerHTML = "";
  ulElement.innerHTML = "";
  arrayLis = [];

  const ciudadElement = formElement.elements.tarea;
  const ciudadParaConvertir = ciudadElement.value;
  const ciudadParaConvertirTxt = mayusFistLetter(ciudadParaConvertir);
  console.log(ciudadParaConvertir);

  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${ciudadParaConvertir}&key=AIzaSyC-YIx41jIe2-fnoVGCoD74UAOmJJAhPtY`
  )
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      let cola = jsonData.results[0].geometry;
      console.log(cola);
      let nuevaLatCiudad = jsonData.results[0].geometry.location.lat;
      let nuevaLongCiudad = jsonData.results[0].geometry.location.lng;
      console.log(nuevaLatCiudad, nuevaLongCiudad); // {lat: 45.425152, lng: -75.6998028}

      var horaActualNueva = Date.now();

      main(nuevaLatCiudad, nuevaLongCiudad, horaActualNueva);
    })
    .catch((error) => {
      console.log(error);
    });

  h2Llueve.classList.add("quitar");

  h2NoLlueve.classList.add("quitar");

  if (buttonLlovera.classList.contains("quitar") === false) {
    buttonLlovera.classList.toggle("quitar");
  }
  if (buttonMenuBurger.classList.contains("quitar") === true) {
    buttonMenuBurger.classList.remove("quitar");
  }
  /* if (formCiudad.classList.contains("quitar") === false) {
    formCiudad.classList.toggle("quitar");
  } */
  fraseDesc8Horas.textContent = `Pronóstico de las próximas 8 horas en ${ciudadParaConvertirTxt}`;
  pHoraActual.classList.remove("quitar");
  pAddressActual.classList.remove("quitar");
  carrusel.classList.remove("quitar");
  ulCurrent.classList.remove("quitar");
  ciudadElement.value = "";
  console.log(arrayLis);
  h1Element.classList.add("quitar");
  fraseDesc8Horas.textContent = "...en las próximas 8 horas";
});

//
//
//Colocamos el boton del menu, pero con la class quitar, que lo que hace es ocultar el contenido
buttonMenuBurger = document.createElement("button");
buttonMenuBurger.setAttribute("id", "menuGoBack");
buttonMenuBurger.classList.toggle("quitar");
header.append(buttonMenuBurger);

//
// Asignamos un evento al boton principal de lloverá para:
// ----- Que se quite cuando clickamos
// ----- Que elimine la class quitar, y muestre en pantalla el icono del menu
// ----- Cambie la frase de debajo del título
// ----- Elimine la class quitar, y muestre en pantalla, la fecha/hora, la direccion y el carrusel con el pronostico
buttonLlovera.addEventListener("click", () => {
  getUbication();
  if (buttonLlovera.classList.contains("quitar") === false) {
    buttonLlovera.classList.toggle("quitar");
  }
  if (buttonMenuBurger.classList.contains("quitar") === true) {
    buttonMenuBurger.classList.remove("quitar");
  }
  /* if (formCiudad.classList.contains("quitar") === false) {
    formCiudad.classList.toggle("quitar");
  } */
  fraseDesc8Horas.textContent = "...en las próximas 8 horas";
  pHoraActual.classList.remove("quitar");
  pAddressActual.classList.remove("quitar");
  carrusel.classList.remove("quitar");
  formCiudad.classList.remove("quitar");
  ulCurrent.classList.remove("quitar");
  h1Element.classList.add("quitar");
  fraseDesc8Horas.classList.add("pantalla");

  /* saveInfo(localStoragePrueba); */
});

//
//
// Asignamos un evento al boton del menú para que deshaga los cambios que se hacen al clickar en ¿LLOVERA?
buttonMenuBurger.addEventListener("click", () => {
  liTiempoAct.innerHTML = "";
  carrusel.innerHTML = "";
  clearInterval(intervalHora);
  h1Element.classList.remove("quitar");
  buttonMenuBurger.classList.toggle("quitar");
  buttonLlovera.classList.remove("quitar");
  pHoraActual.classList.toggle("quitar");
  pAddressActual.classList.toggle("quitar");
  carrusel.classList.toggle("quitar");
  fraseDesc8Horas.classList.remove("pantalla");
  fraseDesc8Horas.textContent = "Comprueba la predicción en otra ubicación";
  formCiudad.classList.remove("quitar");
  ulCurrent.classList.toggle("quitar");
  if (h2Llueve.classList.contains("quitar") === false) {
    h2Llueve.classList.toggle("quitar");
  }
  if (h2NoLlueve.classList.contains("quitar") === false) {
    h2NoLlueve.classList.toggle("quitar");
  }
});

// --------PRUEBAS PARA GUARDAR EN LOCAL STORAGE LA LATLONG-------------
/* let getLocationPromise = () => {
  return new Promise(function (resolve, reject) {
    // Automatically passes the position
    // to the callback
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
function getLocation() {
  getLocationPromise()
    .then((res) => {
      // If promise get resolved
      const { coords, timestamp } = res;
      localStoragePrueba.lati = coords.latitude;
      localStoragePrueba.longi = coords.longitude;
      localStoragePrueba.horaActualSto = timestamp;
    })
    .catch((error) => {
      // If promise get rejected
      console.log(error);

      // Console.error(error);
    });
}

getLocation();

let latitudCargada;
let longitudCargada;
let horaCargada;
if (State.latlong.lati != "") {
  latitudCargada = State.latlong.lati;
  longitudCargada = State.latlong.longi;
  horaCargada = State.latlong.horaActualSto;
  main(latitudCargada, longitudCargada, horaActual);
} */
