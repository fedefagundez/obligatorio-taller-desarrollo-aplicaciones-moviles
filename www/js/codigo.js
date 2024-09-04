let hayUsuarioLogueado = false;
let [latitudDispositivo, longitudDispositivo] = [-34.90656618142827, -56.20353373338655]

iniciarFunionalidades();

function iniciarFunionalidades() {
  agregarEventos();
  generarSelectDeDepartamentos();
  generarSelectDeCiudades();
  ruteo.push("/")
  if (localStorage.getItem("token") !== null && localStorage.getItem("token") !== "") {
    hayUsuarioLogueado = true;
    mostrarMensaje("Usuario logueado, bienvenido!!");
    generarSelectDeCategorias()
  } else {
    mostrarMensaje("Debe iniciar sesión.");
  }
  mostrarMenu();
}

function agregarEventos() {
  document.getElementById("btnRegistro").addEventListener("click", registrarUsuario);
  document.getElementById("btnIngresar").addEventListener("click", ingresarUsuario);
  document.getElementById("btnAgregarEvento").addEventListener("click", agregarEvento);
  document.getElementById("btnVerEventosDelDia").addEventListener("click", mostrarEventosDelDia);
  document.getElementById("btnVerEventosDeDiasAnteriores").addEventListener("click", mostrarEventosDeDiasAnteriores)
}

function registrarUsuario() {
  const nombreUsuario = document.getElementById("txtUsuarioRegistro").value.trim();
  const contrasenia = document.getElementById("txtContraseniaRegistro").value.trim();
  const idDepartamento = document.getElementById("slcDepartamentos").value;
  const idCiudad = document.getElementById("slcCiudades").value;
  if (validarRegistro(nombreUsuario, contrasenia, idDepartamento, idCiudad)) {
    fetchRegistro(nombreUsuario, contrasenia, idDepartamento, idCiudad);
  } else {
    mostrarMensaje("Todos los campos son obligatorios")
  }
}

function ingresarUsuario() {
  const nombreUsuario = document.getElementById("txtUsuarioIngreso").value.trim();
  const contrasenia = document.getElementById("txtContraseniaIngreso").value.trim();
  if (validarIngreso(nombreUsuario, contrasenia)) {
    fetchIngreso(nombreUsuario, contrasenia);
  } else {
    mostrarMensaje("Todos los campos son obligatorios");
  }
}

function generarSelectDeCiudades() {
  document.getElementById("slcDepartamentos").addEventListener("ionChange", generarSelect);
}

function mostrarEventosDelDia(){
  fetchGenerarListaEventos(true);
}

function mostrarEventosDeDiasAnteriores(){
  fetchGenerarListaEventos(false);
}

function agregarEvento() {
  const idCategoria = document.getElementById("slcCategorias").value;
  let fecha = document.getElementById("datetime").value;
  const idUsuario = localStorage.getItem("idUsuario");
  const detalle = document.getElementById("txtDetalles").value;
  if(fecha === undefined){
    fecha = formatDateToLocalISO(new Date())
  }
  const evento = {
    "idCategoria": idCategoria,
    "idUsuario": idUsuario,
    "detalle": detalle,
    "fecha": fecha
  };
  if(idCategoria !== undefined && idCategoria !== ""){
    fetchIngresarEventos(evento);
  } else {
    mostrarMensaje("Debe seleccionar una categoría.")
  }
  
}

function mostrarMensaje(texto) {
  let toast = document.createElement("ion-toast");
  toast.duration = 2000;
  toast.message = texto;
  toast.position = "bottom";
  toast.present();
  document.body.appendChild(toast);
}

// Función para transformar fecha en el formato YYYY-MM-DDTHH:mm:ss en la zona horaria correspondiente
function formatDateToLocalISO(date) {
  const tzOffset = -date.getTimezoneOffset() * 60000; // Offset en milisegundos
  const localISOTime = new Date(date.getTime() + tzOffset).toISOString().slice(0, 19);
  return localISOTime;
}

function borrarEvento(id, esDeHoy){
  fetchBorrarEvento(id, esDeHoy);
}

// Los siguientes procedimientos se utilizan para preservar la información de cada usuario
function reiniciarContenidoUsuario(){
  document.getElementById("totalBiberones").innerText = "";
  document.getElementById("totalPaniales").innerText = "";
  document.getElementById("tiempoBiberones").innerText = "";
  document.getElementById("tiempoPaniales").innerText = "";
  document.getElementById("listado").innerHTML = ""
}

function iniciarMapa(){
  const mapa = `
  <h1>Plazas accesibles</h1>
  <div id="map"></div>
        <style>
          #map {
            height: 80%;
          }
        </style>
  `
  document.getElementById("mapa").innerHTML = mapa;
}

function cerrarMapa(){
  document.getElementById("mapa").innerHTML = "";
}

function implementarMapa(){
  navigator.geolocation.getCurrentPosition(guardarUbicacion, mostrarErrorMapa);
  dibujarMapa();
}

function guardarUbicacion(position) {
  latitudDispositivo = position.coords.latitude;
  longitudDispositivo = position.coords.longitude;
}

function mostrarErrorMapa(error) {
  switch (error.code) {
      case 1:
      mostrarMensaje("El usuario no permitió obtener la ubicación del dispositivo");
          break;
      case 3:
          mostrarMensaje("Expiro el tiempo para poder obtener la ubicación");
          break;
      case 2:
          mostrarMensaje("Ubicación no disponible");

  }
}

async function dibujarMapa() {
  const myIcon = L.icon({
    iconUrl: './icono/marker.png',
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: '',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});
  let map = L.map('map').setView([latitudDispositivo, longitudDispositivo], 14.5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.marker([latitudDispositivo, longitudDispositivo]).addTo(map).bindPopup("Mi ubicación");
  const plazas = await fetchObtenerPlazas();
  plazas.forEach(plaza =>{
      L.marker([plaza.latitud,plaza.longitud], {icon: myIcon}).addTo(map).bindPopup(plaza.idPlaza);
  })
  
  console.log(plazas)
}