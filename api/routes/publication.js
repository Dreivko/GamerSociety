'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications' });

api.get('/probando-pub', md_auth.ensureAuth, PublicationController.probando);
api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.get('/publications-user/:user/:page?', md_auth.ensureAuth, PublicationController.getPublicationsUser);
api.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);
api.put('/feedback/:id', md_auth.ensureAuth, PublicationController.pushFeedback);
api.put('/nofeedback/:id', md_auth.ensureAuth, PublicationController.pushNoFeedback);
api.put('/unfeedback/:id', md_auth.ensureAuth, PublicationController.pullFeedback);
api.put('/unnofeedback/:id', md_auth.ensureAuth, PublicationController.pullNoFeedback);
api.get('/feedbacks/:id',  PublicationController.getFeedbacks);
api.get('/nofeedbacks/:id', PublicationController.getNoFeedbacks);
api.get('/isfeedback/:id', md_auth.ensureAuth, PublicationController.isfeedback);
api.get('/isnofeedback/:id', md_auth.ensureAuth, PublicationController.isnofeedback);
module.exports = api;