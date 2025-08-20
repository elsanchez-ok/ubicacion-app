function verificarGPS() {
    const bloqueo = document.getElementById("bloqueo");
    const login = document.getElementById("login");
  
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
  
      document.getElementById("latitudInput").value = lat;
      document.getElementById("longitudInput").value = lon;
  
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const direccion = data.display_name || "Dirección no disponible";
        document.getElementById("direccionInput").value = direccion;
  
        bloqueo.classList.add("hidden");
        login.classList.remove("hidden");
      } catch (err) {
        alert("Error al obtener dirección.");
      }
    }, () => {
      alert("Debes permitir acceso a tu ubicación.");
    });

// mapa.js
function mostrarMapa(lat, lon) {
    const mapa = L.map('mapa').setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);
    L.marker([lat, lon]).addTo(mapa).bindPopup("Tu ubicación").openPopup();
  }
  

  }
  