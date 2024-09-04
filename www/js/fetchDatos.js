function generarSelectDeDepartamentos() {
  fetch("https://babytracker.develotion.com/departamentos.php",
    {
      method: "Get",
      headers: {
        "Content-type": "application/json"
      }
    }
  )
    .then(respuesta => respuesta.json())
    .then(datos => {
      // Recordar ver los errores
      let select = "";
      let i = 1;
      if (datos.codigo === 200) {
        datos.departamentos.forEach(departamento => {
          select += `<ion-select-option value="${departamento.id}">${departamento.nombre}</ion-select-option>`
        });
        document.getElementById("slcDepartamentos").innerHTML = select;
      } else {
        mostrarMensaje("Hubo un error al cargar los departamentos");
      }
    })
}

function generarSelect(evento) {
  const idCiudad = evento.detail.value;
  fetch(`https://babytracker.develotion.com/ciudades.php?idDepartamento=${idCiudad}`,
    {
      method: "Get",
      headers: {
        "Content-type": "application/json"
      }
    }
  )
    .then(respuesta => respuesta.json())
    .then(datos => {
      // Recordar ver los errores
      let select = "";
      if (datos.codigo === 200) {
        datos.ciudades.forEach(ciudad => {
          select += `<ion-select-option value="${ciudad.id}">${ciudad.nombre}</ion-select-option>`
        });
        document.getElementById("slcCiudades").innerHTML = select;
      } else {
        mostrarMensaje("Hubo un error al cargar los ciudades")
      }
    })

}

function fetchRegistro(nombreUsuario, contrasenia, idDepartamento, idCiudad) {
  const usuario = {
    "usuario": nombreUsuario,
    "password": contrasenia,
    "idDepartamento": idDepartamento,
    "idCiudad": idCiudad
  }
  fetch("https://babytracker.develotion.com/usuarios.php",
    {
      method: "Post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(usuario)
    }
  )
    .then(respuesta => {
      return respuesta.json()
    })
    .then(datos => {
      if (datos.codigo === 200) {
        localStorage.setItem("token", datos.apiKey);
        localStorage.setItem("idUsuario", datos.id);
        hayUsuarioLogueado = true;
        mostrarMenu();
        ruteo.push("/")
        mostrarMensaje("Usuario registrado correctamente.")
        setTimeout(() => mostrarMensaje("Usuario logueado, bienvenido!!"), 3000)
      } else {
        mostrarMensaje(datos.mensaje);
      }
    })
    .catch(error => mostrarMensaje("Hubo un error en la comunicación."))
}

function fetchIngreso(nombreUsuario, contrasenia) {
  const usuario = {
    "usuario": nombreUsuario,
    "password": contrasenia,
  }
  fetch("https://babytracker.develotion.com/login.php",
    {
      method: "Post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(usuario)
    }
  )
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.codigo === 200) {
        localStorage.setItem("token", datos.apiKey);
        localStorage.setItem("idUsuario", datos.id);
        hayUsuarioLogueado = true;
        ruteo.push("/")
        mostrarMenu();
        mostrarMensaje("Usuario logueado correctamente.")
      } else {
        mostrarMensaje(datos.mensaje)
      }
    })
    .catch(error => mostrarMensaje("Hubo un error en la comunicación"))
}

function generarSelectDeCategorias() {
  fetch("https://babytracker.develotion.com/categorias.php",
    {
      method: "Get",
      headers: {
        "Content-type": "application/json",
        "apikey": localStorage.getItem("token"),
        "iduser": localStorage.getItem("idUsuario")
      }
    }
  )
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.codigo === 200) {
        const categorias = datos.categorias;
        let select = "";
        for (let i = 0; i < categorias.length; i++) {
          select += `<ion-select-option value="${categorias[i].id}">${categorias[i].tipo}</ion-select-option>`
        }
        document.getElementById("slcCategorias").innerHTML = select;
      }
    })
    .catch(error => mostrarMensaje("Ha habido un error al cargar las categorías."))
}

function fetchIngresarEventos(evento) {
  fetch("https://babytracker.develotion.com/eventos.php",
    {
      method: "Post",
      headers: {
        "Content-type": "application/json",
        "apikey": localStorage.getItem("token"),
        "iduser": localStorage.getItem("idUsuario")
      },
      body: JSON.stringify(evento)
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.codigo === 200) {
        document.getElementById("slcCategorias").value = ""
        document.getElementById("txtDetalles").value = ""
        mostrarMensaje(datos.mensaje)
      } else {
        mostrarMensaje(datos.mensaje)
      }
    })
    .catch(error => {
      mostrarMensaje("Hubo un error al registrar el evento")
    })
}

async function fetchGenerarListaEventos(esDeHoy) {
  const idUsuario = localStorage.getItem("idUsuario");
  const categorias = await fetchCategorias();
  fetch(`https://babytracker.develotion.com/eventos.php?idUsuario=${idUsuario}`,
    {
      method: "Get",
      headers: {
        "Content-type": "application/json",
        "apikey": localStorage.getItem("token"),
        "iduser": idUsuario
      }
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if(datos.codigo === 200){
        let ionItems = "";
        const eventos = datos.eventos;
        for(let i = 0; i <= eventos.length - 1; i++){
          // Mostrar los elementos de la lista
          const evento = eventos[i];
          const fechaActual = new Date()
          const fechaEvento = new Date(evento.fecha)
          const condicion = esDeHoy ? fechaEvento.toDateString() === fechaActual.toDateString() : fechaEvento.toDateString() !== fechaActual.toDateString()
          if(condicion){
            const categoria = categorias.find(categoria => categoria.id === evento.idCategoria);
            ionItems += `
            <ion-item>
              <ion-img src="https://babytracker.develotion.com/imgs/${categoria.imagen}.png"></ion-img>
              <ion-label>${categoria.tipo}</ion-label>
              <ion-button slot="end" id="${evento.id}" onClick="borrarEvento(${evento.id}, ${esDeHoy})">Borrar</ion-button>
            </ion-item>
            `
          }
        }
        document.getElementById("listado").innerHTML = ionItems;
      } else {
        mostrarMensaje("Ha ocurrido un error.")
      }
      })
      .catch(error => mostrarMensaje("Hubo un error en la comunicación"))
}

function fetchCategorias(){
  return fetch("https://babytracker.develotion.com/categorias.php",
    {
      method: "Get",
      headers: {
        "Content-type": "application/json",
        "apikey": localStorage.getItem("token"),
        "iduser": localStorage.getItem("idUsuario")
      }
    }
  )
  .then(respuesta => respuesta.json())
  .then(datos => {
    if(datos.codigo === 200){
      return datos.categorias
    }
  })
  .catch(error => mostrarMensaje("Ha habido una error en la comunicación"))
}

async function fetchBorrarEvento(id, esDeHoy){
  await borrarEventoAsincrono(id);
  fetchGenerarListaEventos(esDeHoy);  
}

function borrarEventoAsincrono(id){
  const idUsuario = localStorage.getItem("idUsuario");
  fetch(`https://babytracker.develotion.com//eventos.php?idEvento=${id}`,
    {
      method: "Delete",
      headers: {
        "Content-type": "application/json",
        "apikey": localStorage.getItem("token"),
        "iduser": idUsuario
      }
    }
  )
  .then(respuesta => respuesta.json())
  .then(datos => {
    mostrarMensaje(datos.mensaje)

  })
  .catch(error => mostrarMensaje("Hubo un error en la comunicación."))
}

async function fetchObtenerBiberonesPaniales(){
  const idUsuario = localStorage.getItem("idUsuario");
  const categorias = await fetchCategorias();
  const idCategoriaBiberon = categorias.find(categoria => categoria.tipo === "Biberón").id;
  const idCategoriaPanial = categorias.find(categoria => categoria.tipo === "Pañal").id;
  fetch(`https://babytracker.develotion.com/eventos.php?idUsuario=${idUsuario}`,
    {
      method: "Get",
      headers: {
        "Content-type": "application/json",
        "apikey": localStorage.getItem("token"),
        "iduser": idUsuario
      }
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if(datos.codigo === 200){
        const fechaActual = new Date()
        const eventosDelDia = datos.eventos.filter(evento => {
          const fechaEvento = new Date(evento.fecha)
          return fechaEvento.toDateString() === fechaActual.toDateString()
        });
        let tiempoBiberon = "";
        let tiempoPanial = "";
        let cantidadBiberones = 0;
        let cantidadPaniales = 0;
        if(eventosDelDia.find(evento => evento.idCategoria === idCategoriaBiberon) !== undefined){
          cantidadBiberones = eventosDelDia.reduce((i, evento) => i + (evento.idCategoria === idCategoriaBiberon ? 1 : 0), 0);
          const fechaUltimoBiberon = eventosDelDia.filter(evento => evento.idCategoria === idCategoriaBiberon).reduce((max, evento) => new Date(evento.fecha).getTime() > new Date(max.fecha).getTime() ? evento : max).fecha;
          const milisegundoBiberon = new Date().getTime() - new Date(fechaUltimoBiberon).getTime();
          const [horasBiberon, minutosBiberon] = calcularDiferenciaDeTiempo(milisegundoBiberon);
          tiempoBiberon = `${horasBiberon} horas y ${minutosBiberon} minutos`;
        }

        if(eventosDelDia.find(evento => evento.idCategoria === idCategoriaPanial) !== undefined){
          cantidadPaniales = eventosDelDia.reduce((i, evento) => i + (evento.idCategoria === idCategoriaPanial ? 1 : 0), 0);
          const fechaUltimoPanial = eventosDelDia.filter(evento => evento.idCategoria === idCategoriaPanial).reduce((max, evento) => new Date(evento.fecha).getTime() > new Date(max.fecha).getTime() ? evento : max).fecha;
          const milisegundoPanial = new Date().getTime() - new Date(fechaUltimoPanial).getTime();
          const [horasPaniales, minutosPaniales] = calcularDiferenciaDeTiempo(milisegundoPanial);
          tiempoPanial = `${horasPaniales} horas y ${minutosPaniales} minutos`;
        }
        
        document.getElementById("totalBiberones").innerText = cantidadBiberones;
        document.getElementById("totalPaniales").innerText = cantidadPaniales;
        document.getElementById("tiempoBiberones").innerText = tiempoBiberon;
        document.getElementById("tiempoPaniales").innerText = tiempoPanial;

      } else {
        mostrarMensaje("Ha ocurrido un error.")
      }
      })
      .catch("Hubo un error en la comunicación.")
}

function calcularDiferenciaDeTiempo(milisegundos){
  const horas = Math.trunc(milisegundos / 3600000);
  const minutos = Math.trunc((milisegundos % 3600000)/60000)
  return [horas, minutos]
}

function fetchObtenerPlazas(){
  return fetch("https://babytracker.develotion.com/plazas.php",
    {
      method: "Get",
      headers: {
        "Content-type": "application/json",
        "apikey": localStorage.getItem("token"),
        "iduser": localStorage.getItem("idUsuario")
      }
    }
  )
  .then(respuesta => respuesta.json())
  .then(datos => {
    if(datos.codigo === 200){
      return datos.plazas
    } else {
      mostrarMensaje("No ha sido posible obtener las plazas")
    }
  })
  .catch(error => mostrarMensaje("Ha habido una error en la comunicación"))
}



