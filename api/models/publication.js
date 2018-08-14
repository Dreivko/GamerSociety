'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

//modelo publicacion
var PublicationSchema = Schema({
    usuario: { type: Schema.ObjectId, ref: 'User' },
    texto: String,
    archivo: String,
    creado_el: String,
});

module.exports = mongose.model('Publication', PublicationSchema);