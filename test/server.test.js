import assert from 'assert'
import axios from 'axios'
import { conectar, desconectar } from '../src/servidor/servidor.js'

import {
    obtenerUsuarios,
    agregarUsuario,
    borrarUsuarios, obtenerUsuarioSegunId
} from '../src/usuarios/usuarios.js'


const usuario1 = {
    nombreUsuario:"pabloDominguez",
    apellido:"Dominguez",
    nombre:"Pablo",
    mail:"pablo@gmail.com",
    fechaNacimiento:"14/03/1999",
    domicilio:"Rivadavia21",
    dni:"1234567"
}

const usuario2 = {
    nombre:"Juan",
    apellido:"Dominguez",
    nombreUsuario:"juanDominguez",
    dni:"123456789",
    mail:"juan@gmail.com",
    domicilio:"Rivadavia12",
    fechaNacimiento:"22/12/2000"
}

describe('servidor pruebas', () => {
    let urlUsuarios

    before (async () => {
        const puerto =  await conectar()
        urlUsuarios = `http://localhost:${puerto}/api/usuarios`
    })
    after(async () => {
        await desconectar()
    })
    beforeEach(() => {
        borrarUsuarios()
    })
    afterEach(() => {
        borrarUsuarios()
    })

    describe('servidor escuchando', () => {
        describe('usuarios', () => {
            describe('intento de agregar uno', () =>{
                describe('si los datos son validos', () =>{
                    it('crea, guarda y devuelve un usuario', async () => {
                        
                        const usuariosAnterior = obtenerUsuarios()

                        const user = {
                            nombre:"Pablo",
                            apellido:"Dominguez",
                            nombreUsuario:"pabloDominguez",
                            dni:"1234567",
                            mail:"pablo@gmail.com",
                            domicilio:"Rivadavia21",
                            fechaNacimiento:"14/03/1999"
                            
                        }

                        const { data: usuarioAgregado, status } = await axios.post(urlUsuarios, user)
                        assert.strictEqual(status, 201)

                        const usuariosDespues = obtenerUsuarios()

                        const usuarioAgregadoEsperado = {...user, id: usuarioAgregado.id}
                        assert.deepStrictEqual(usuariosDespues, usuariosAnterior.concat(usuarioAgregadoEsperado))
                    })
                })

                describe('si no carga el nombre de usuario', () => {
                    it('no agrega nada y devuelve un error', async () => {

                        const usuariosAntes = obtenerUsuarios()

                        const user = {
                            nombre:"Pablo",
                            dni: 12345678,
                            apellido:"Dominguez",
                            nombreUsuario: "",
                            mail:"pablo@gmail.com",
                            domicilio:"Rivadavia21",
                            fechaNacimiento:"14/03/1999"
                        }
                        await assert.rejects(
                            axios.post(urlUsuarios, user),
                            error => {
                                assert.strictEqual(error.response.status, 400)
                                return true
                            }
                        )

                        const usuariosDespues = obtenerUsuarios()
                        assert.deepStrictEqual(usuariosDespues, usuariosAntes)

                    })
                })

                
            })
            describe('pedir usuarios por id', () => {
                it('devuelve el usuario', async () => {
                    
                    const usuarioAgregado = agregarUsuario(usuario2)

                    let usuarioObtenido
                    const{ data, status } = await axios.get(urlUsuarios + '/' + usuarioAgregado.id)
                    assert.strictEqual(status, 200)
                    usuarioObtenido = data

                    assert.deepStrictEqual(usuarioObtenido, usuarioAgregado)
                })
            })
            
            describe('pedir usuario con id que no existe', () => {
                it('no encuentra el usuario', async () => {
                    await assert.rejects(
                        axios.get(urlUsuarios + '/asd'),
                        error => {
                            assert.strictEqual(error.response.status, 404)
                            return true
                        }
                    )
                })
            })

            describe('pedir que borre un usuario por id', () => {
                it('borre el usuario', async () =>{
                    const usuarioAgregado = agregarUsuario(usuario1)
                    const {status} =await axios.delete(urlUsuarios + '/' + usuarioAgregado.id)
                    assert.strictEqual(status, 204)

                    const usuariosDespues = obtenerUsuarios()
                    assert.ok(usuariosDespues.every(u => u.id !== usuarioAgregado.id))
                })
            })

            describe('pedir que borre un usuario que no exista', () =>{
                it('no encuentra el usuario', async () => {
                    await assert.rejects(
                        axios.delete(urlUsuarios + 'asd'),
                        error => {
                            assert.strictEqual(error.response.status, 404)
                            return true
                        }
                    )
                })
            })

            describe('mandarle un nuevo usuario y un id', () =>{
                it('reemplaza el existente con el nuevo', async () =>{
                    
                    const usuarioAgregado = agregarUsuario(usuario1)
                    const nuevoNombreUsuario = "dominguesPablo"
                    const datosAct = {...usuarioAgregado, nombreUsuario: nuevoNombreUsuario}

                    const  {status} = await axios.put(urlUsuarios + '/' + usuarioAgregado.id, datosAct)
                    assert.strictEqual(status,200)

                    const usuarioBuscado = obtenerUsuarioSegunId(usuarioAgregado.id)
                    assert.deepStrictEqual(usuarioBuscado, datosAct)
                    

                })
            })

            describe('mandarle un id invalido', () =>{
                it('lanza error',async () => {
                    
                    await assert.rejects(
                        axios.put(urlUsuarios + 'asd'),
                        error => {
                            assert.strictEqual(error.response.status, 404)
                            return true
                        }
                       
                    )
                })
            })
        })
    })
})

/*describe('mandarle un dato nuevo invalido', () =>{
    it('lanza error',async () => {
        
        const usuarioAgregado = agregarUsuario(usuario1)
        const nuevoNombre = ''
        const datosAct = {...usuarioAgregado, nombreUsuario: nuevoNombre}

        axios.put(urlUsuarios + '/' + usuarioAgregado.id, datosAct)
            error => {
                assert.strictEqual(error.response.status, 404)
                return true       
            } 

            const usuarioBuscado = obtenerUsuarioSegunId(usuarioAgregado.id)
            assert.deepStrictEqual(usuarioBuscado, datosAct)*/