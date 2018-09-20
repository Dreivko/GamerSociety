'use strict'

var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var jwt = require('../services/jwt');


//pruebas
function home(req, res) {
	res.status(200).send({
		message: 'Hola mundo desde el servidor nodejs'
	});
}

function pruebas(req, res) {
	res.status(200).send({
		message: 'Accion de pruebas en el servidor nodejs'
	});
}

//registro de usurios
function saveUser(req, res) {
	var params = req.body;
	var user = new User();

	if (params.name && params.surname && params.nick && params.email && params.password) {

		user.name = params.name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;


		//Controlar usuarios registrados 
		User.find({
			$or: [
				{ email: user.email.toLowerCase() },
				{ nick: user.nick.toLowerCase() }
			]
		}).exec((err, users) => {
			if (err) return res.status(500).send({ message: 'Error en la petición de usuario' });
			if (users && users.length >= 1) {
				return res.status(200).send({ message: 'El usuario ya existe' });
			} else {
				//Cifrar las contraseñas y guardar los datos
				bcrypt.hash(params.password, null, null, (err, hash) => {
					user.password = hash;
					user.save((err, userStored) => {
						if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });

						if (userStored) {
							res.status(200).send({ user: userStored });
						} else {
							res.status(404).send({ message: 'No se ha registrado el usuario' });
						}
					});

				});
			}
		});



	} else {
		res.status(200).send({
			message: 'Envia todos los campos necesarios'
		});
	}

}


//login de usuarios
function loginUser(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({ email: email }, (err, user) => {
		if (err) return res.status(500).send({ message: 'Error en la petición' });

		if (user) {
			bcrypt.compare(password, user.password, (err, check) => {
				if (check) {

					if (params.gettoken) {
						return res.status(200).send({
							token: jwt.createToken(user)
						});

					} else {
						//devolver los datos del usuario
						user.password = undefined;
						return res.status(200).send({ user });
					}

				} else {
					return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
				}
			});
		} else {
			return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
		}
	});
}

//conseguir datos de un usuario
function getUser(req, res) {
	var userId = req.params.id;

	User.findById(userId, (err, user) => {
		if (err) return res.status(500).send({
			message: 'Error en la petición'
		});

		if (!user) return res.status(404).send({ message: 'El usuario no existe' });
		/////////////////////  
		Follow.find({ "followed": req.user.sub }, (err, following) => {
			if (err) return res.status(500).send({
				message: 'Error en la petición'
			});
			if (!following) return res.status(404).send({ message: 'El usuario no existe' });
			//console.log(following); 

			if (following) {
				Follow.find({ "user": req.user.sub }, (err, followed) => {
					if (err) return res.status(500).send({
						message: 'Error en la petición'
					});
					if (!followed) return res.status(404).send({ message: 'El usuario no existe' });
					//console.log(followed);

					if (followed) {
						return res.status(200).send({
							user,
							following: following,
							followed: followed
						});

					};
				});


			};
		});
	});
}
function getOnlyUser(req, res) {
	var userId = req.params.id;

	User.findById(userId, (err, user) => {
		if (err) return res.status(500).send({
			message: 'Error en la petición'
		});

		if (!user) return res.status(404).send({ message: 'El usuario no existe' });
		/////////////////////  
		return res.status(200).send({user});
	});
}


async function followThisUser(identity_user_id, user_id) {

	var following = await Follow.find({ "user": identity_user_id }).exec((err, follow) => {
		if (err) return handleError(err);
		//console.log(follow);
		return follow;

	});
	var followed = await Follow.find({ "followed": identity_user_id }).exec((err, follow) => {
		if (err) return handleError(err);
		//console.log(follow);		
		return follow;
	});
	//console.log(following);
	//console.log(followed);	
	return {
		following: following,
		followed: followed
	}

}
//Devolver listado de usuarios paginado
function getUsers(req, res) {
	var identity_user_id = req.user.sub;
	var page = 1;

	if (req.params.page) {
		page = req.params.page;
	}

	var itemsPerPage = 5;

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		if (err) return res.status(500).send({
			message: 'Error en la petición'
		});

		if (!users) return res.status(404).send({
			message: 'No hay usuarios en la plataforma'
		});
		//////////////////////////////////////
		Follow.find({ "user": req.user.sub }, (err, following) => {
			if (err) return res.status(500).send({
				message: 'Error en la petición'
			});
			if (!following) return res.status(404).send({ message: 'El usuario no existe' });
			//console.log(following); 

			if (following) {
				Follow.find({ "followed": req.user.sub }, (err, followed) => {
					if (err) return res.status(500).send({
						message: 'Error en la petición'
					});
					if (!followed) return res.status(404).send({ message: 'El usuario no existe' });
					//console.log(followed);

					if (followed) {
						//Procesar following ids
						var following_clean = [];

						if (following) {
							following.forEach((follow) => {
								following_clean.push(follow.followed);
							});
						}

						//procesar followed ids
						var followed_clean = [];

						if (followed) {
							followed.forEach((follow) => {
								followed_clean.push(follow.user);
							});
						}


						return res.status(200).send({
							users,
							users_following: following_clean,
							users_follow_me: followed_clean,
							total,
							pages: Math.ceil(total / itemsPerPage)
						});

					};
				});


			};
		});
		/////////////////////////////////////

		/*
		followUserIds(identity_user_id).then((value) => {
			return res.status(200).send({
				users,
				users_following: value.following,
				users_follow_me: value.followed,
				total,
				pages: Math.ceil(total/itemsPerPage)
			});
		});*/

	});
}

async function followUserIds(user_id) {
	var following = await Follow.find({ "user": user_id }).select({ '_id': 0, '_v': 0, 'user': 0 }).exec((err, follows) => {
		//console.log(follows);
		return follows;
	});

	var followed = await Follow.find({ "followed": user_id }).select({ '_id': 0, '_v': 0, 'followed': 0 }).exec((err, follows) => {
		return follows;
	});

	//Procesar following ids
	var following_clean = [];

	if (following) {
		following.forEach((follow) => {
			following_clean.push(follow.followed);
		});
	}

	//procesar followed ids
	var followed_clean = [];

	if (followed) {
		followed.forEach((follow) => {
			followed_clean.push(follow.user);
		});
	}

	return {
		following: following_clean,
		followed: followed_clean
	};
}


//contador de seguidores y de seguidos
function getCounters(req, res) {
	var userId = req.user.sub;
	if (req.params.id) {
		userId = req.params.id;
	}


	////////////////////////////////////////////////////////////

	Follow.count({ "user": userId }, (err, following) => {
		if (err) {
			return res.status(500).send({
				message: 'Error en la petición'
			});
		}
		if (following) {
			Follow.count({ "followed": userId }, (err, followed) => {
				if (err) return res.status(500).send({
					message: 'Error en la petición'
				});
				if (followed) {
					Publication.count({ "user": userId }, (err, publications) => {
						if (err) return res.status(500).send({
							message: 'Error en la petición'
						});
						if (publications) {
							return res.status(200).send({
								following: following,
								followed: followed,
								publications: publications
							});

						};
					});

				};
			});


		};
	});
	////////////////////////////////////////////////////////////
	/*
	getCountFollow(userId).then((value) =>{
		return res.status(200).send(value);
	});
	*/
}

async function getCountFollow(user_id) {
	var following = await Follow.count({ "user": user_id }).exec((err, count) => {
		if (err) return handleError(err);
		return count;
	});

	var followed = await Follow.count({ "followed": user_id }).exec((err, count) => {
		if (err) return handleError(err);
		return count;
	});

	var publication = await Publication.count({ 'user': user_id }).exec((err, count) => {
		if (err) {
			return handleError(err);
		}
		return count;
	});

	return {
		following: following,
		followed: followed,
		publications: publications
	}
}

//Actualizar datos del usuario
function updateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;
	//borar propiedad password
	delete update.password;
	if (userId != req.user.sub && req.user.role != "ROLE_ADMIN") {
		return res.status(500).send({ message: 'No tiene permisos para actualizar datos de Usuario' });
	}

	User.find({
		$or: [
			{ email: update.email.toLowerCase() },
			{ nick: update.nick.toLowerCase() }
		]
	}).exec((err, users) => {
		var user_isset = false;
		users.forEach((user) => {
			if (user && user._id != userId) {
				user_isset = true;
			}
		})
		if (user_isset == true) {
			return res.status(500).send({ message: 'Datos ya estan en Uso' })
		}

		User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
			if (err) { return res.status(500).send({ message: 'Error en la petición' }); }
			if (!userUpdated) { return res.status(404).send({ message: 'No se ha podido actualizar datos' }); }
			return res.status(200).send({ user: userUpdated });
		});
	});
}


//Subir imagen de usuario
function uploadImage(req, res) {
	var userId = req.params.id;

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (userId != req.user.sub) {
			return removeFilesOfUpload(res, file_path, 'No tienes permiso para actualizar los datos de este usuario');
		}

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
			//actualizar la imagen
			User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
				if (err) return res.status(500).send({
					message: 'Error en la petición'
				});

				if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

				return res.status(200).send({ user: userUpdated });
			});

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
	var path_file = './uploads/users/' + image_file;

	fs.exists(path_file, (exists) => {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen...' });
		}
	});

}


module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
	uploadImage,
	getImageFile,
	getCounters,
	getOnlyUser
}