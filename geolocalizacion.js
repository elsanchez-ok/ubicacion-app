/* ============================================
   Ubicación App - Lógica principal
   Autor: JOSEPH
   Fecha: 2025
   ============================================ */

// Validación de login
document.getElementById("login-btn")?.addEventListener("click", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (username === "admin" && password === "1234") {
    message.textContent = "✅ Inicio de sesión exitoso";
    message.style.color = "green";

    // Guardar sesión
    localStorage.setItem("loggedIn", "true");

    // Redirigir al mapa
    setTimeout(() => {
      window.location.href = "mapa.html";
    }, 1000);
  } else {
    message.textContent = "❌ Usuario o contraseña incorrectos";
    message.style.color = "red";
  }
});

// Protección de acceso en mapa.html
if (window.location.pathname.includes("mapa.html")) {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (isLoggedIn !== "true") {
    alert("Debes iniciar sesión para acceder al mapa.");
    window.location.href = "index.html";
  }
}
---
// ============================================
// Geolocalización y mapa con Leaflet
// ============================================

if (window.location.pathname.includes("mapa.html")) {
  // Esperar a que el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById("map");

    if (!mapContainer) {
      console.error("Elemento #map no encontrado.");
      return;
    }

    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
      mapContainer.innerHTML = "<p>Tu navegador no soporta geolocalización.</p>";
      return;
    }

    // Mostrar loader mientras se obtiene la ubicación
    mapContainer.innerHTML = '<div class="loader"></div>';

    // Obtener ubicación actual
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Inicializar el mapa
        const map = L.map("map").setView([latitude, longitude], 15);

        // Cargar tiles de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Agregar marcador en la ubicación actual
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup("📍 Estás aquí").openPopup();

        // Mostrar coordenadas en consola
        console.log(`Ubicación actual: Lat ${latitude}, Lng ${longitude}`);

        // Eliminar loader
        mapContainer.innerHTML = "";
      },
      (error) => {
        let message = "Error al obtener la ubicación.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Permiso de ubicación denegado.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Ubicación no disponible.";
            break;
          case error.TIMEOUT:
            message = "Tiempo de espera agotado.";
            break;
        }
        mapContainer.innerHTML = `<p>${message}</p>`;
        console.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
---
// ============================================
// Funciones utilitarias
// ============================================

/**
 * Verifica si el usuario está logueado
 * @returns {boolean}
 */
function isUserLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

/**
 * Cierra la sesión del usuario
 */
function logoutUser() {
  localStorage.removeItem("loggedIn");
  alert("Sesión cerrada correctamente.");
  window.location.href = "index.html";
}

/**
 * Formatea coordenadas en texto legible
 * @param {number} lat
 * @param {number} lng
 * @returns {string}
 */
function formatCoordinates(lat, lng) {
  return `Latitud: ${lat.toFixed(5)}, Longitud: ${lng.toFixed(5)}`;
}

/**
 * Muestra un mensaje en consola con estilo
 * @param {string} msg
 */
function logStyled(msg) {
  console.log(`%c${msg}`, "color: #007bff; font-weight: bold;");
}

// ============================================
// Preparación para historial de ubicaciones
// ============================================

let locationHistory = [];

/**
 * Guarda una ubicación en el historial
 * @param {number} lat
 * @param {number} lng
 */
function saveLocationToHistory(lat, lng) {
  const timestamp = new Date().toISOString();
  locationHistory.push({ lat, lng, timestamp });

  // Guardar en localStorage (opcional)
  localStorage.setItem("locationHistory", JSON.stringify(locationHistory));
}

/**
 * Recupera historial desde localStorage
 */
function loadLocationHistory() {
  const stored = localStorage.getItem("locationHistory");
  if (stored) {
    locationHistory = JSON.parse(stored);
  }
}

// ============================================
// Preparación para notificaciones
// ============================================

/**
 * Muestra una notificación en pantalla
 * @param {string} title
 * @param {string} body
 */
function showNotification(title, body) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  }
}
---
// ============================================
// Soporte para múltiples usuarios (demo)
// ============================================

const users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "joseph", password: "dev2025", role: "developer" },
  { username: "guest", password: "guest", role: "viewer" },
];

/**
 * Verifica credenciales contra la lista de usuarios
 * @param {string} username
 * @param {string} password
 * @returns {object|null}
 */
function validateUser(username, password) {
  return users.find((user) => user.username === username && user.password === password) || null;
}

// Reemplazar login básico por validación avanzada
document.getElementById("login-btn")?.addEventListener("click", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  const user = validateUser(username, password);

  if (user) {
    message.textContent = `✅ Bienvenido, ${user.username}`;
    message.style.color = "green";

    // Guardar sesión con rol
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("username", user.username);

    // Redirigir
    setTimeout(() => {
      window.location.href = "mapa.html";
    }, 1000);
  } else {
    message.textContent = "❌ Credenciales inválidas";
    message.style.color = "red";
  }
});

// ============================================
// Seguridad básica en mapa.html
// ============================================

if (window.location.pathname.includes("mapa.html")) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const role = localStorage.getItem("userRole");

  if (!isLoggedIn) {
    alert("Acceso denegado. Inicia sesión primero.");
    window.location.href = "index.html";
  }

  // Mostrar rol en consola
  console.log(`Rol del usuario: ${role}`);
}

// ============================================
// Preparación para APIs externas
// ============================================

/**
 * Consulta una API externa (demo)
 * @param {string} endpoint
 */
async function fetchExternalData(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Error en la respuesta");
    const data = await response.json();
    console.log("Datos recibidos:", data);
  } catch (error) {
    console.error("Error al consultar API:", error.message);
  }
}

// Ejemplo de uso
// fetchExternalData("https://nominatim.openstreetmap.org/search?q=San+Pedro+Sula&format=json");
---
// ============================================
// Comentarios técnicos y estructura modular
// ============================================

/**
 * Este archivo gestiona:
 * - Validación de usuarios y roles
 * - Seguridad básica en rutas protegidas
 * - Inicialización del mapa con Leaflet
 * - Marcadores interactivos y eventos
 * - Preparación para APIs externas
 *
 * Recomendaciones:
 * - Separar lógica en módulos: auth.js, map.js, api.js
 * - Usar Webpack o Vite para bundling
 * - Implementar control de sesiones con tokens
 * - Añadir manejo de errores visuales (UI feedback)
 */

// ============================================
// Extensibilidad: funciones para el futuro
// ============================================

/**
 * Agrega un marcador personalizado con ícono
 * @param {number} lat
 * @param {number} lon
 * @param {string} label
 * @param {string} iconUrl
 */
function addCustomMarker(lat, lon, label, iconUrl) {
  const customIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
  marker.bindPopup(`<strong>${label}</strong>`).openPopup();
}

/**
 * Limpia todos los marcadores del mapa
 */
function clearAllMarkers() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

/**
 * Centra el mapa en una ubicación específica
 * @param {number} lat
 * @param {number} lon
 * @param {number} zoom
 */
function centerMap(lat, lon, zoom = 13) {
  map.setView([lat, lon], zoom);
}

// ============================================
// Exportar funciones si usas módulos ES6
// ============================================

// export { validateUser, fetchExternalData, addCustomMarker, clearAllMarkers, centerMap };
    
