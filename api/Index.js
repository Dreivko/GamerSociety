'use strict'

// Cargamos el módulo de mongoose para poder conectarnos a MongoDB
var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
// Usamos el método connect para conectarnos a nuestra base de datos
mongoose.connect('mongodb://localhost:27017/RedSocialDB', { useNewUrlParser: true })
    .then(() => {
        console.log('La conexión a MongoDB se ha realizado correctamente!!');

        //crear servidor
        app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:3800");
        });
    })
    .catch(err => console.log(err));