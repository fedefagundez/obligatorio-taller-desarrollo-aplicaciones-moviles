function validarRegistro(usuario, contrasenia, idDepartamento, idCiudad) {
    return (usuario.length !== 0 &&
    contrasenia.length !== 0 &&
    idDepartamento !== undefined &&
    idCiudad !== undefined
  )
}

function validarIngreso(usuario, contrasenia){
  return (usuario.length !== 0 && contrasenia.length !== 0)
}
