'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

//modelo publicacion
var FollowSchema = Schema({
    usuario: { type: Schema.ObjectId, ref: 'User' },
    seguido: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongose.model('Follow', FollowSchema);