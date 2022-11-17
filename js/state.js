"use strict";

const localStorageStateLlovera = window.localStorage.getItem("StateLlovera");

/* 
Ejemplo objeto tareas:
tareaObject = {
  text: "Hola",
  done: false,
    };
 */

// inicializo el estado de mi aplicación
const State = {
  /* latlong: localStorageStateLlovera
    ? JSON.parse(localStorageStateLlovera).latlong
    : "", */

  nigth: localStorageStateLlovera
    ? JSON.parse(localStorageStateLlovera).nigth
    : false,
};

const saveState = () => {
  const tasksJSON = JSON.stringify(State);
  window.localStorage.setItem("StateLlovera", tasksJSON);
};

/* const addInfo = (liTiempo) => {
  State.liTiempo.unshift(liTiempo);
  // console.log(State.tasks);
  saveState();
}; */

const toggleMode = () => {
  State.nigth = !State.nigth;

  saveState();
};

/* const saveInfo = (localStoragePrueba) => {
  State.latlong = localStoragePrueba;

  saveState();
}; */

export default State;
export { toggleMode /*  saveInfo */ };
