'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = Schema({
	category: String,
	user: String
});

module.exports = mongoose.model('Feedback', FeedbackSchema);