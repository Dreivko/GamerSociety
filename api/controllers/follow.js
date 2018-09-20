'use Strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');


var User = require('../models/user');
var Follow = require('../models/follow');


//Seguir a otro usuario
function saveFollow(req,res){
	var params = req.body;
	var follow = new Follow();

	follow.user = req.user.sub;
	follow.followed = params.followed;

	follow.save((err, followStored) => {
		if (err) return res.status(500).send({message:'Error al guardar el seguimiento'});

		if(!followStored) return res.status(404).send({message:'El seguimiento no se ha guardado'});

		return res.status(200).send({follow:followStored});
	});
}

//dejar de seguir a otro usuario
function deleteFollow(req,res){
	var userId = req.user.sub;
	var followId = req. params.id;

	Follow.find({'user':userId, 'followed':followId}).remove(err => {
		if (err) return res.status(500).send({message:'Error al dejar de seguir'});

		return res.status(200).send({message:'El follow se ha eliminado correctamente'});
	});
}

//obtener lista de usuarios que se sigue
function getFollowingUsers(req,res){
	var userId = req.user.sub;

	if(req.params.id && req.params.page){
		userId = req.params.id;
	}

	var page = 1;

	if(req.params.page){
		page = req.params.page;

	}else{
		page = req.params.id;
	}

	var itemsPerPage = 5;

	Follow.find({user:userId}).populate({path:'followed'}).paginate(page,itemsPerPage,(err, follows, total) =>{
		if (err) return res.status(500).send({message:'Error en el servidor'});
		if (!follows) return res.status(404).send({message:'No te sigue ningun usuario'});

		Follow.find({"followed":req.user.sub},(err,followed) => {
			if(err) return res.status(500).send({
				message: 'Error en la petición'
			});
			if (!followed) return res.status(404).send({message: 'El usuario no existe'});
			//console.log(following); 

			if (followed) {
				Follow.find({"user":req.user.sub},(err,following) => {
					if(err) return res.status(500).send({
						message: 'Error en la petición'
					});
					if (!following) return res.status(404).send({message: 'El usuario no existe'});
					//console.log(followed);

					if (following) {
						return res.status(200).send({
			 				total: total,
							pages: Math.ceil(total/itemsPerPage),
							follows,
			 				users_following: following,
			 				users_follow_me: followed
			 			});

					};	
				});		


			};	
		});	
	});


/*
	Follow.find({user:userId}).populate({path: 'followed'}).paginate(page,itemsPerPage,(err, follows, total) =>{
		if (err) return res.status(500).send({message:'Error en el servidor'});
		if (!follows) return res.status(404).send({message:'No estas siguiendo a algun usuario'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			follows
		});
	});*/


}


//obtener lista de usuarios que me siguen
function getFollowedUsers(req,res){

	var userId = req.user.sub;

	if(req.params.id && req.params.page){
		userId = req.params.id;
	}

	var page = 1;

	if(req.params.page){
		page = req.params.page;

	}else{
		page = req.params.id;
	}

	var itemsPerPage = 5;

	Follow.find({followed:userId}).populate({path:'user'}).paginate(page,itemsPerPage,(err, follows, total) =>{
		if (err) return res.status(500).send({message:'Error en el servidor'});
		if (!follows) return res.status(404).send({message:'No te sigue ningun usuario'});

		Follow.find({"followed":req.user.sub},(err,followed) => {
			if(err) return res.status(500).send({
				message: 'Error en la petición'
			});
			if (!followed) return res.status(404).send({message: 'El usuario no existe'});
			//console.log(following); 

			if (followed) {
				Follow.find({"user":req.user.sub},(err,following) => {
					if(err) return res.status(500).send({
						message: 'Error en la petición'
					});
					if (!following) return res.status(404).send({message: 'El usuario no existe'});
					//console.log(followed);

					if (following) {
						return res.status(200).send({
			 				total: total,
							pages: Math.ceil(total/itemsPerPage),
							follows,
			 				users_following: following,
			 				users_follow_me: followed
			 			});

					};	
				});		


			};	
		});	
	});

}

//obtener lista de usurios que sigo  o me siguen sin paginar
function getMyFollows(req,res){
	var userId = req.user.sub;
	//usuarios que sigo
	var find = Follow.find({user:userId});
	
	if (req.params.followed) {
		//usuarios que me siguen
		find = Follow.find({followed:userId});
	}

	find.populate('user followed').exec((err, follows)  =>{
		if (err) return res.status(500).send({message:'Error en el servidor'});
		if (!follows) return res.status(404).send({message:'No sigues a ningun usuario'});

		return res.status(200).send({follows});   
	});

}




module.exports = {
	saveFollow,
	deleteFollow,
	getFollowingUsers,
	getFollowedUsers,
	getMyFollows
}