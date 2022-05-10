import { crearUsuario } from './usuario.js'

const usuarios = []

export function obtenerUsuarios() {
    return [...usuarios]
}

/*function copiarUsuarios(usuarios) {
    return usuarios.map(copiarUsuario)
}

export function obtenerUsuarios() {
    return copiarUsuarios(usuarios)
}*/

export function agregarUsuario(datosUsuario) {
    const usuario = crearUsuario(datosUsuario)
    usuarios.push(usuario)
    return usuario
}

export function borrarUsuarios() {
    while (usuarios.length > 0) {
        usuarios.pop()
    }
}

function copiarUsuario(usuario) {
    return {...usuario}
    
}

export function obtenerUsuarioSegunId(id) {
    const usuarioBuscado = usuarios.find(c => c.id === id)
    if (usuarioBuscado) {
        return copiarUsuario(usuarioBuscado)
    } else {
        throw new Error('usuario no encontrado')
    }
}

export function borrarUsuarioSegunId(id) {
    const idUsuario = usuarios.findIndex(u => u.id === id)
    if (idUsuario === -1) {
        throw new Error('usuario no encontrado')
    } else {
        usuarios.splice(idUsuario, 1)
    }
}

export function reemplazarUsuario(id, datosUsuario) {
    const idUsuario = usuarios.findIndex(u => u.id === id)
    if (idUsuario === -1) {
        throw new Error('usuario no encontrado')
    } else {
            const usuario = crearUsuario(datosUsuario)
            usuario.id = id
            usuarios[idUsuario] = usuario      
    }
}

/*export function borrarUsuariosSinDomicilioCargado(){
    const usuariosSinDomicilio =usuarios.filter(u => u.domicilio === "")
    usuariosSinDomicilio.forEach(u => usuarios.pop(u))
    
}*/