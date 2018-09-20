'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Conexión a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin123@ds245210.mlab.com:45210/gamersocietydb', { useMongoClient: true })
    .then(() => {
        console.log("Conexión exitosa con la base de datos rs_denuncias");

        //crear servidor
        app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:3800");
        });

    })
    .catch(err => console.log(err));