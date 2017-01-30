var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var users = {};

module.exports = function(passport){

	var isValidPassword = function(doc, password){		
		return bCrypt.compareSync(password, doc.password);
	};

	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

	passport.serializeUser(function(user, done){
		console.log('usuario serializado: ' + user.username );
		return done(null, user);
	});

	passport.deserializeUser(function(id, done){
		user.findById(id, function(err, doc){
			console.log('deserialize User: ' + doc.username );
			return done(err, doc);
		});		
	});

	passport.use('login', new LocalStrategy({
		passReqToCallback : true
	}, function(req, username, password, done){

		var query = {'username': username};

		user
			.findOne(query, function(err, doc){

				if(err)
					return done(true, false, {message:err});

				if(!doc){
					console.log('no existe el usuario');
					return done(true, false, {message:'no existe el usuario'});
				}

				if(!isValidPassword(doc, password)){
					console.log('password errado!');
					return done(true, false, {message:'password errado!'});
				}	

				done(false, doc);

			});
	}));

	passport.use('signup', new LocalStrategy({
		passReqToCallback : true
	}, function(req, username, password, done){
				
		var query = {'username': username};

		user
			.findOne(query, function(err, doc){

				if(err){
					console.log('error')
					return done(true, null, 'error')
				}

				if(doc){
					console.log('User already exists')
					return done(true, null, 'User already exists')
				}else{

					var newUser = new user();

					newUser.username = username;
					newUser.password = createHash(password);					
					newUser.email = req.body.email;

					if(typeof req.params.admin != 'undefined')
						newUser.admin = req.params.admin;

					if(typeof req.body.distributorLine != 'undefined')
						newUser.distributorLine = req.body.distributorLine;

					if(typeof req.body.location != 'undefined')
						newUser.location = req.body.location;

					newUser.save(function(err){
						if(err){
							done(true, null, 'Error saved');
						}
						
						return done(false, newUser, 'Success');
					});

				}
			});
	}));

	return router;
};