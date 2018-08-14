'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

//modelo publicacion
var MessageSchema = Schema({
    emisor: { type: Schema.ObjectId, ref: 'User' },
    receptor: { type: Schema.ObjectId, ref: 'User' },
    texto: String,
    creado_el: String
});

module.exports = mongose.model('Message', MessageSchema);