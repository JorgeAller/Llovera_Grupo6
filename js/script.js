"use strict";
import State, { toggleMode } from "./state.js";
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
  // Llamamos a la funcion que hicimos en clase que nos devolv??a la ciudad, con los parametros lat y long que coge de nuestra ubicaci??n
  // Ya miraremos como hacer lo de cambiar, que de momento lo veo demasiado lioso tal y como lo tenemos.

  let addresFinal = await addres(lat, long);
  const addresActual = document.querySelector("#addresActual");
  addresActual.textContent = addresFinal; // Y aqu?? metemos el texto de la ciudad que sea en un p nuevo vacio que cree para meter esta info.

  //
  //
  if (data !== null) {
    const fragment = document.createDocumentFragment();
    const fragment2 = document.createDocumentFragment();
    const main = document.querySelector("main");

    //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    ESTO ES PARA LA INFO DEL TIEMPO ACTUAL, PARA PONER EN GRANDE EN EL CENTRO    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    let tiempoActual = [];
    tiempoActual[0] = data.current;

    let temperaturaAct = Math.round(tiempoActual[0].temp); // Redondee el n??mero porque poner los decimales de la temp no lo veia muy util. Si queremos que salga solo hay que quitar el math

    const pTemperaturaAct = document.createElement("p");
    pTemperaturaAct.textContent = temperaturaAct + "??C";

    let fechaAct = tiempoActual[0].dt;
    const pDatosFechaAct = document.createElement("p");
    pDatosFechaAct.textContent = timeConverter(fechaAct);

    let objectWeather = tiempoActual[0].weather;

    for (let a of objectWeather) {
      let dataMainAct = a.main;
      let dataDescAct = a.description;
      let dataIconAct = a.icon;

      const pDatosLluviaMainAct = document.createElement("p");
      pDatosLluviaMainAct.textContent = dataMainAct;

      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    ESTO ES PARA LAS FOTOS DEL TIEMPO ACTUAL, PARA PONER EN GRANDE EN EL CENTRO    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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
        //Nubes tambi??n. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
        imgWeatherActual = document.createElement("img");
        imgWeatherActual.setAttribute("id", "png_act");
        imgWeatherActual.setAttribute("src", `./img/Nublado.png`);
        //
      } else if (dataIconAct === "04d" || dataIconAct === "04n") {
        //Nubes tambi??n. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
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
        //Los diferentes tipos de nieve  que haya (OJALA NIEVE EN CORU??A XD)
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

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    ESTO YA ES PARA LAS FICHAS DE TIEMPO DE LAS PROXIMAS 8 HORAS    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    let horas = data.hourly;
    let horasOnly8 = horas.slice(1, 9);
    let i = 0;

    /*----- DESCOMENTO ESTO PARA VER EL ARRAY CON LA PREDICCION DE LAS PROXIMAS 8 HORAS QUE DEVUELVE LA API-------*/
    // console.log(horasOnly8);

    for (let tiempo of horasOnly8) {
      let temperatura = Math.round(tiempo.temp); // Redondee el n??mero porque poner los decimales de la temp no lo veia muy util. Si queremos que salga solo hay que quitar el math

      const pTemperatura = document.createElement("p");
      pTemperatura.textContent = temperatura + "??";

      let fecha = tiempo.dt;
      const pDatosFecha = document.createElement("p");
      pDatosFecha.textContent = timeConverter(fecha);

      let objectWeather = tiempo.weather;

      /*  ------DESCOMENTA ESTO PARA VER EL ARRAY DE CADA HORA DE LA PREDICCI??N Y VER QUE DEUELVE LA API.*/
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

        // Seg??n la p??gina de la api, asignamos a cada Descripci??n el icono corresponie

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
          //Nubes tambi??n. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_nubes");
          imgWeather.setAttribute("src", `./img/Nublado.png`);
          //
        } else if (dataIcon === "04d" || dataIcon === "04n") {
          //Nubes tambi??n. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
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
          //Los diferentes tipos de nieve  que haya (OJALA NIEVE EN CORU??A XD)
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_nieve");
          imgWeather.setAttribute("src", `./img/Nieve.png`);
          //
        } else if (dataIcon === "50d" || dataIcon === "50n") {
          //Nubes tambi??n. Como tenemos un icono de nubes, ponemos el mismo para poco nublado, medio y mucho, total no nos hace falta saber que tiempo hace
          imgWeather = document.createElement("img");
          imgWeather.setAttribute("id", "png_nubes");
          imgWeather.setAttribute("src", `./img/Nublado.png`);
        }

        descWeather = document.createElement("p");
        descWeather.textContent = mayusFistLetter(dataDesc);

        //
        // Al li que cree antes del 2?? for (anidado), le metemos (append) todos los datos que necesitamos en cada hora del pron??stico
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
        //
        // Y al fragment que creamos antes de entrar al 1?? for, le metemos (append) esa info en un solo bloque para luego meterla toda junta en vez de por partes
        fragment.append(liTiempo);
      }
    }
    //
    //
    // Y una vez salimos de los bucles, al ul creado al principio del codigo, le metemos (append) ese fragment.
    // As?? imprimimos en pantalla todas las fichas del carrusel en un solo bloque en vez de ir imprimiendo una a una
    ulElement.append(fragment);
  }
  if (arrayLis.includes("Rain")) {
    h2Llueve.classList.remove("quitar");
    // bodyElement.classList.add("gotasLluvia"); Solo est?? por si queremos meter un fondo de pantalla con video lluvia png
  } else {
    h2NoLlueve.classList.remove("quitar");
  }
}

function getUbication() {
  ulElement.innerHTML = "";
  const status = document.querySelector("#status");

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    horaActual = position.timestamp;

    // --------- DESCOMENTAR ESTO PARA VER EL OBJETO GeolocationPosition ----------
    // let hola = position;
    // console.log(hola);

    main(latitude, longitude, horaActual);
  }

  function error() {
    status.textContent = "No se pudo obtener su localizaci??n";
  }

  if (!navigator.geolocation) {
    status.textContent =
      "La geolocaliozaci??n no es compatible con su navegador";
  } else {
    /* status.textContent = "Localizando???"; */
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

//Funci??n para convertir el tiempo formato timestamp, en una hora correcta
function timeConverter(UNIXtimestamp) {
  const a = new Date(UNIXtimestamp * 1000);
  // Todo esto comentado aqu?? abajo, ser??a para a??adirle fecha al tiempo que indicamos cuando convertimos
  //
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
  // Utilizamos la funcion de mirar la longitud del numero, para formatear bien la fecha. Si getLength es 0 o 1, a??ade un 0 delante del numero
  const time =
    (getLength(hour) <= 1 ? "0" + hour : hour) +
    ":" +
    (getLength(min) <= 1 ? "0" + min : min); /* +
    (getLength(sec) <= 1 ? "0" + sec : sec); */
  return time;
}

//
//
// Funci??n para obtener la direcci??n de los datos que nos da la ubicacion del navegador (lat y long)
async function addres(lat, long) {
  try {
    // Le cambi?? las data1,2,3 por algo m??s descriptivo. Y adem??s lo met?? todo en el TryCatch por si acaso hay algun fallo al meter las coordenadas
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

    //Resulta que el c??digo del inicio siempre tiene 9 d??gitos XXXX+XXX (inlcuido el espacio de despues).
    //Por lo tanto nos vale con sacar una string desde la posici??n 9 hasta el final de la string original
    /* let addresFinal = addresWithCode.substring(9, addresWithCode.length);

    return addresFinal; */
  } catch (error) {
    let direccion = "ERROR AL OBTENER LA UBICACI??N";
    console.error("Error en la ubicaci??n. No se pudo obtener la Direcci??n");
    return direccion;
  }
  return null;
}

//
//
//Funci??n para mirar la cantidad de cifras de un numero (para arreglar la hora)
function getLength(number) {
  return number.toString().length;
}

// Funci??n para poner la primer letra mayuscula de cada string que le pasemos
// Util porque cada descripci??n del tiempo que nos da la API nos la da toda en min??sculas
function mayusFistLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
//
//
//
// Necesidades para que funcione el boton modo noche
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
  // cuando abro la p??gina o hago F5 pongo la clase noche si State.nigth === true
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

//
//

// Asignamos evento que se ejecuta al enviar el formulario de escribir la ciudad
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

  fraseDesc8Horas.textContent = `Pron??stico de las pr??ximas 8 horas en ${ciudadParaConvertirTxt}`;
  pHoraActual.classList.remove("quitar");
  pAddressActual.classList.remove("quitar");
  carrusel.classList.remove("quitar");
  ulCurrent.classList.remove("quitar");
  ciudadElement.value = "";
  console.log(arrayLis);
  h1Element.classList.add("quitar");
  fraseDesc8Horas.textContent = "...en las pr??ximas 8 horas";
});

//
//
//Colocamos el boton del menu, pero con la class quitar, que lo que hace es ocultar el contenido
buttonMenuBurger = document.createElement("button");
buttonMenuBurger.setAttribute("id", "menuGoBack");
buttonMenuBurger.classList.toggle("quitar");
header.append(buttonMenuBurger);

//
// Asignamos un evento al boton principal de llover?? para:
// ----- Que se quite cuando clickamos
// ----- Que elimine la class quitar, y muestre en pantalla el icono del menu
// ----- Cambie la frase de debajo del t??tulo
// ----- Elimine la class quitar, y muestre en pantalla, la fecha/hora, la direccion y el carrusel con el pronostico
buttonLlovera.addEventListener("click", () => {
  getUbication();

  if (buttonLlovera.classList.contains("quitar") === false) {
    buttonLlovera.classList.toggle("quitar");
  }
  if (buttonMenuBurger.classList.contains("quitar") === true) {
    buttonMenuBurger.classList.remove("quitar");
  }

  fraseDesc8Horas.textContent = "...en las pr??ximas 8 horas";
  pHoraActual.classList.remove("quitar");
  pAddressActual.classList.remove("quitar");
  carrusel.classList.remove("quitar");
  formCiudad.classList.remove("quitar");
  ulCurrent.classList.remove("quitar");
  h1Element.classList.add("quitar");
  fraseDesc8Horas.classList.add("pantalla");
});

//
//
// Asignamos un evento al boton del men?? para que deshaga los cambios que se hacen al clickar en ??LLOVERA?
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
  fraseDesc8Horas.textContent = "Comprueba la predicci??n en otra ubicaci??n";
  formCiudad.classList.remove("quitar");
  ulCurrent.classList.toggle("quitar");
  if (h2Llueve.classList.contains("quitar") === false) {
    h2Llueve.classList.toggle("quitar");
  }
  if (h2NoLlueve.classList.contains("quitar") === false) {
    h2NoLlueve.classList.toggle("quitar");
  }
});

//
//
//
//
