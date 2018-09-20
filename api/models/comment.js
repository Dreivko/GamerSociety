'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
	comments: [{
		text: String,
		created_at: String,
		user: { type: Schema.ObjectId, ref: 'User' },
		publication: { type: Schema.ObjectId, ref: 'User' }
	}]
});

module.exports = mongoose.model('Comment', CommentSchema);