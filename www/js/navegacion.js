ruteo = document.getElementById("ruteo");
menu = document.getElementById("menu");

inicioNavegacion()

function inicioNavegacion(){
  ocultarPaginas();
  implementarNavegacion();
  //document.getElementById("datetime").addEventListener("ionChange", cerrarModal)
}

function implementarNavegacion(){
  ruteo.addEventListener("ionRouteWillChange", mostrarPagina)
}

function mostrarPagina(evento) {
  
  let rutaDestino = evento.detail.to;
  ocultarPaginas();
  const destinos = {
    "/": function (){
      mostrarElementos("inicio", "block");
    },
    "/Login": function(){
      mostrarElementos("login", "block");
    },
    "/Registro": function(){
      mostrarElementos("registro", "block");
    },
    "/Ingreso-de-eventos": function(){
      mostrarElementos("ingresoEventos", "block");
      // A traves de consulta a ChatGPT
      const fechaMaxima = formatDateToLocalISO(new Date());
      document.getElementById("datetime").max = fechaMaxima;
    },
    "/Listado-de-eventos": function(){
      mostrarElementos("listadoEventos", "block");
    },
    "/Informe-de-eventos": function(){
      mostrarElementos("informeEventos", "block");
      fetchObtenerBiberonesPaniales();
    },
    "/Plazas-accesibles": function(){
      iniciarMapa();
      implementarMapa();
      mostrarElementos("plazasAccesibles", "block");
    },
    "/Logout": function(){
      localStorage.clear();
      hayUsuarioLogueado = false;
      mostrarElementos("inicio", "block");
      ruteo.push("/");
      mostrarMenu()
      reiniciarContenidoUsuario()
      mostrarMensaje("Usuario deslogueado correctamente. Hasta la próxima!!")
    }
  }

  destinos[rutaDestino]();

}

function cerrarMenu() {
  menu.close();
}

function ocultarPaginas() {
  const paginas = document.getElementsByClassName("ion-page");
  for(let i = 1; i < paginas.length; i++){
      paginas[i].style.display = "none";
  }
}

function mostrarMenu(){
  const botonesMenu = document.getElementsByClassName("menu");

  if(hayUsuarioLogueado){
    for(let i = 0; i < botonesMenu.length; i++){
      console.log()
      if(Array.from(botonesMenu[i].classList).includes("logueado")){
        botonesMenu[i].style.display = "block"
      } else {
        botonesMenu[i].style.display = "none"
      }
    }
  } else {
    for(let i = 0; i < botonesMenu.length; i++){
      if(Array.from(botonesMenu[i].classList).includes("no-logueado")){
        botonesMenu[i].style.display = "block"
      } else {
        botonesMenu[i].style.display = "none"
      }
    }
  }
 
}

function mostrarElementos(id, display) {
  document.getElementById(id).style.display = display;
}

function ocultarElementos(id) {
  document.getElementById(id).style.display = "none";
}

// Procedimiento no implementado
function cerrarModal(){
  document.getElementById("modal").dismiss()
}