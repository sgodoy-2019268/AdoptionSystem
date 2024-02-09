'use strict' //Modo estricto

import User from './user.model.js'
import { checkPassword, encrypt, checkUpdate } from '../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        console.log(data)
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la información en la BD
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be wirth username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async(req, res)=>{
    try {
        //Capturar los datos (body)
        let {username, password} = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username})//buscar un solo registro
        //verificar que la contrasena coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                username: user.username,
                name: user.name,
                role: user.role
            }
            //responde al usuario
            return res.send({message: `Helcome ${loggedUser.name}`, loggedUser})
        }
        return res.status(404).send({menssage: 'Invalid credentials'}) 
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res)=>{
    try {
        //Obtener el id del ususario a actualizar
        let {id} = req.params
        //obtener los datos a actualizar
        let data = req.body
        //validar si data trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be update or missing data'})
        //Validar si tiene permisos (tokenizacion) X Hoy no lo veremos X
        //Actualizar (BD)
        let updateUser = await User.findOneAndUpdate(
            {_id: id},
            data//Los datos que se van a actualizar
        )
        //Validar la actualizacion
        if(!updateUser) return res.status(401).send({message: 'User not fund and not update'})
        //respondo al usuario
        return res.send({message: 'Update user', updateUser})
    } catch (err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})        
    }
}

export const deleteU = async(req, res)=>{
    try {
        //Obtener el Id
        let { id } = req.params
        //Validar si esta logeado y es el mismo X No lo vemos hoy X
        //Eliminar (deleteOne / findOneAndDelete)
        let deletedUser = await User.findOneAndDelete({_id: id})
        //Verificar que se elimino
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}