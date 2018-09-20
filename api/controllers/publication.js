'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res) {
    res.status(200).send({ message: 'Controlador Publicacion' });
}

function savePublication(req, res) {
    var params = req.body;
    if (!params.text) {
        return res.status(200).send({ message: '¡Debes diligenciar texto!' });
    }
    console.log(req.user.sub);
    var publication = new Publication;
    publication.text = params.text;
    publication.file = "null";
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) {
            return res.status(500).send({ message: 'Error al guardar la publicacion' });
        }
        if (!publicationStored) {
            return res.status(404).send({ message: 'La publicacion no fue guardada' });
        }
        return res.status(200).send({ publication: publicationStored });
    });
}

function pushFeedback(req, res) {
    var publicationId = req.params.id;
    var update = req.body;
    Publication.findById(publicationId, (err, publicationUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!publicationUpdated) return res.status(404).send({ message: 'No es posible dar una reaccion a esta solicitud' });
        publicationUpdated.feedback.push(req.user.sub);
        publicationUpdated.save();
        return res.status(200).send({ publication: publicationUpdated });
    });
}

function pullFeedback(req, res) {
    var publicationId = req.params.id;
    var update = req.body;
    Publication.findById(publicationId, (err, publicationUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!publicationUpdated) return res.status(404).send({ message: 'No es posible dar una reaccion a esta solicitud' });
        publicationUpdated.feedback.pull(req.user.sub);
        publicationUpdated.save();
        return res.status(200).send({ publication: publicationUpdated });
    });
}

function getFeedbacks(req, res) {
    var contador = 0;
    Publication.findById(req.params.id, (err, publicacion) => {
        var feedbacks = publicacion.feedback;
        if (err) {
            return handleError(err);
        }
        console.log(feedbacks.length);
        return res.status(200).send({ contador: feedbacks.length });
    });
    return 0;
}


function pushNoFeedback(req, res) {
    var publicationId = req.params.id;
    var update = req.body;
    Publication.findById(publicationId, (err, publicationUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!publicationUpdated) return res.status(404).send({ message: 'No es posible dar una reaccion a esta solicitud' });
        publicationUpdated.nofeedback.push(req.user.sub);
        publicationUpdated.save();
        return res.status(200).send({ publication: publicationUpdated });
    });
}

function pullNoFeedback(req, res) {
    var publicationId = req.params.id;
    var update = req.body;
    Publication.findById(publicationId, (err, publicationUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!publicationUpdated) return res.status(404).send({ message: 'No es posible dar una reaccion a esta solicitud' });
        publicationUpdated.nofeedback.pull(req.user.sub);
        publicationUpdated.save();
        return res.status(200).send({ publication: publicationUpdated });
    });
}
function getNoFeedbacks(req, res) {
    var contador = 0;
    Publication.findById(req.params.id, (err, publicacion) => {
        var noFeedbacks = publicacion.nofeedback;
        if (err) {
            return handleError(err);
        }
        console.log(noFeedbacks.length);
        return res.status(200).send({ contador: noFeedbacks.length });
    });
    return 0;
}

function getPublications(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 4;
    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) {
            return res.status(500).send({ message: 'Error al Consultar seguimiento' });
        }
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        follows_clean.push(req.user.sub);
        Publication.find({ user: { "$in": follows_clean } }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) {
                return res.status(500).send({ message: 'Error al mostrar publicaciones' });
            }
            if (!publications) {
                return res.status(404).send({ message: 'No hay publicaciones' });
            }
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        });
    });
}

function getPublication(req, res) {
    var publicationId = req.params.id;
    Publication.findById(publicationId, (err, publication) => {
        if (err) {
            return res.status(500).send({ message: 'Error al retornar publicacion' });
        }
        if (!publication) {
            return res.status(404).send({ message: 'No existe la publicacion' });
        }
        res.status(200).send({ publication });
    });
}

function getPublicationsUser(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var user = req.user.sub;
    if (req.params.user) {
        user = req.params.user;
    }
    var itemsPerPage = 4;
    Publication.find({ user: user }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
        if (err) {
            return res.status(500).send({ message: 'Error al mostrar publicaciones' });
        }
        if (!publications) {
            return res.status(404).send({ message: 'No hay publicaciones' });
        }
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications
        })
    });
}

function deletePublication(req, res) {
    var publicationId = req.params.id;
    Publication.find({ 'user': req.user.sub, '_id': publicationId }).remove(err => {
        if (err) {
            return res.status(500).send({ message: 'Error al borrar la publicacion' });
        }

        res.status(200).send({ message: 'Publicacion Eliminada :(' });
    });
}

//Subir imagen de usuario
function uploadImage(req, res) {
    var publicationId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Publication.findOne({ 'user': req.user.sub, '_id': publicationId }).exec((err, publication) => {
                if (publication) {
                    Publication.findByIdAndUpdate(publicationId, { file: file_name }, { new: true }, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({
                            message: 'Error en la petición'
                        });

                        if (!publicationUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

                        return res.status(200).send({ publication: publicationUpdated });
                    });
                } else {
                    removeFilesOfUpload(res, file_path, 'No es permitido administrar la publicacion');
                }
            })
            //actualizar la imagen publicacion


        } else {
            removeFilesOfUpload(res, file_path, 'Extensión no válida');
        }

    } else {
        return res.status(200).send({ message: 'No se han subido imagenes' });
    }
}

function removeFilesOfUpload(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) return res.status(200).send({ message: message });
    });
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/' + image_file;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });

}
function isfeedback(req, res) {
    var contador = 0;
    Publication.findById(req.params.id, (err, publicacion) => {
        var feedbacks = publicacion.feedback;
        if (err) {
            return handleError(err);
        }
        if (feedbacks.find(req.user.sub)){
            return true;
        }
    });
    return false;
}
function isnofeedback(req, res) {
    var contador = 0;
    Publication.findById(req.params.id, (err, publicacion) => {
        var feedbacks = publicacion.nofeedback;
        if (err) {
            return handleError(err);
        }
        if (feedbacks.find(req.user.sub)){
            return true;
        }
    });
    return false;
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    getPublicationsUser,
    deletePublication,
    uploadImage,
    getImageFile,
    pullFeedback,
    pushFeedback,
    pullNoFeedback,
    pushNoFeedback,
    getFeedbacks,
    getNoFeedbacks,
    isfeedback,
    isnofeedback
}