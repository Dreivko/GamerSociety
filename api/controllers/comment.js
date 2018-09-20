'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Comment = require('../models/comment');
var User = require('../models/user');
var Publication = require('../models/publication');

function probando(req, res) {
    res.status(200).send({ message: 'Controlador Publicacion' });
}


function saveComment(req, res) {
    var params = req.body;
    if (!params.text) {
        return res.status(200).send({ message: '¡Debes diligenciar texto!' });
    }
    Comment.findById(params.publication, (err, wantedComment) => {
        if (err) return res.status(500).send({ message: 'Error en la petición de comentario' });   
        if(wantedComment){
            wantedComment.comments.unshift({ 
                text: params.text,
                created_at: moment().unix(),
                user: req.user.sub,
                publication: params.publication
             });

            Comment.findByIdAndUpdate(params.publication, wantedComment, { new: true }, (err, commentUpdated) => {
                if (err) {
                    return res.status(500).send({ message: 'Error al guardar el comentario' });
                }
                if (!commentUpdated) {
                    return res.status(404).send({ message: 'El comentario no se pudo guardar' });
                }
                return res.status(200).send({ comment: commentUpdated });
            });
            
        }else{ //crear la coleccion de la publicacíon si no existe
            var comment = new Comment; 
            comment._id = params.publication;
            
            comment.comments.unshift({ 
                text: params.text,
                created_at: moment().unix(),
                user: req.user.sub,
                publication: params.publication
             });        
            comment.save((err, commentStored) => {
                if (err) {
                    return res.status(500).send({ message: 'Error al guardar el comentario' });
                }
                if (!commentStored) {
                    return res.status(404).send({ message: 'El comentario no se pudo guardar' });
                }
                return res.status(200).send({ comment: commentStored });
            });
        }

    });
    
}


function getCommentsPublication(req, res) {
    if (req.params.page) {
        page = req.params.page;
    }
    var user = req.user.sub;
    var publication = req.params.publication;
   /* 
    Comment.findById(publication, (err, wantedComment) => {
        if (err) {
            return res.status(500).send({ message: 'Error al obtener los comentarios' });
        }
        if(!wantedComment){
            return res.status(200).send({
                comments: [],
                publicationId: publication
            });   
        }

        var comments = wantedComment.comments;  
            return res.status(200).send({
                comments,
                publicationId: publication
            });   
            
    });*/

    Comment.findById(publication).populate('comments.user').exec((err, wantedComment) => {
        if (err) {
            return res.status(500).send({ message: 'Error al obtener los comentarios' });
        }
        if(!wantedComment){
            return res.status(200).send({
                comments: [],
                publicationId: publication
            });   
        }

        var comments = wantedComment.comments;            
        return res.status(200).send({
            comments,
            publicationId: publication
        });   
            
    });
}

function getCountComments(req, res){
    if (req.params.page) {
        page = req.params.page;
    }
    var user = req.user.sub;
    var publication = req.params.publication;
    Comment.findById(publication, (err, wantedComment) => {
        if (err) {
            return res.status(500).send({ message: 'Error al obtener los comentarios' });
        }
        if(!wantedComment){
            return res.status(200).send({ 
                total: 0,
                publicationId: publication 
            });
        }
        var totalComments = wantedComment.comments.length; 
        return res.status(200).send({
            total: totalComments,
            publicationId: publication
        });   
            
    });
}



module.exports = {
    probando,
    saveComment,
    getCommentsPublication,
    getCountComments
}


