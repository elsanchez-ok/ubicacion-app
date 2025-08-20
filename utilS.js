function guardarEnLocalStorage(clave, valor) {
    localStorage.setItem(clave, valor);
  }
  
  function obtenerDeLocalStorage(clave) {
    return localStorage.getItem(clave);
  }
  