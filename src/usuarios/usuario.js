import { obtenerNuevoId } from '../compartido/ids.js'

function lanzarErrorDeValidacionDeDatos(campo) {
    const error = new Error('error de validacion de datos')
    error.tipo = 'DATA_VALIDATION'
    error.campo = campo
    throw error
}

export function crearUsuario(datos) {
    if (!datos.nombre) {
        lanzarErrorDeValidacionDeDatos('nombre')
    }

    if (!datos.apellido) {
        lanzarErrorDeValidacionDeDatos('apellido')
    }
    
    if (!datos.nombreUsuario) {
        lanzarErrorDeValidacionDeDatos('nombreUsuario')
    }
    
    if (!datos.mail) {
        lanzarErrorDeValidacionDeDatos('mail')
    }
    const usuario = {
        id: obtenerNuevoId('usuario'),
        nombreUsuario: datos.nombreUsuario,
        apellido: datos.apellido,
        nombre: datos.nombre,
        mail: datos.mail,
        fechaNacimiento: datos.fechaNacimiento,
        domicilio: datos.domicilio,
        dni: datos.dni
    }
    return usuario
}