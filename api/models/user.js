'use strict'

//variables de las librerias para la creacion de modelos
var mongose = require('mongoose');
var Schema = mongose.Schema;

//modelo usuario
var UserSchema = Schema({
    nombre: String,
    apellido: String,
    nick: String,
    email: String,
    contrasena: String,
    rol: String,
    imagen: String
});

module.exports = mongose.model('User', UserSchema);