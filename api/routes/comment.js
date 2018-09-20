'use strict'

var express = require('express');
var CommentController = require('../controllers/comment');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-com', md_auth.ensureAuth, CommentController.probando);
api.post('/comment', md_auth.ensureAuth, CommentController.saveComment);
api.get('/comments-publication/:publication', md_auth.ensureAuth, CommentController.getCommentsPublication);
api.get('/count-publication/:publication', md_auth.ensureAuth, CommentController.getCountComments);


module.exports = api;