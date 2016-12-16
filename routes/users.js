var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user');
var distributionLine = mongoose.model('distributionLine');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	var isValidPassword = function(doc, password){
		return bCrypt.compareSync(password, doc.username);
	};

	var createHash = function(password){
		return bCrypt.hashSync(password, bcrypt.genSaltSync(10), null);
	};

	passport.serializeUser(function(user, done){
		console.log('usuario sealizado: ' + user.username );
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		user.findById(id, function(err, doc){
			onsole.log('deserialize User: ' + doc.username );
			done(err, doc);
		});		
	});

	passport.use('login', new LocalStrategy({
		passReqToCallback : true	
	}, function(req, username, password, done){

		var query = {'username': username};

		user
			.findOne(query, function(err, doc){

				if(err)
					return done(null);

				if(!doc){
					console.log('no existe el usuario');
					return done(null, false);
				}

				if(!isValidPassword(doc, password)){
					console.log('password is false');
					return done(null, false);
				}

				req.session.isLoggedIn = true;
				req.session.user = username;	

				return done(null, doc);

			});
	}));

	passport.use('signup', new LocalStrategy({
	}, function(req, username, password, done){

		var query = {'username': username};

		user
			.findOne(query, function(err, doc){

				if(err){
					console.log('error')
					return done(err);
				}

				if(user){
					console.log('User already exists')
					return 
				}else{

					var newUser = new user();

					newUser.username = username;
					newUser.password = createHash(password);
					newUser.distributorLine = req.params.distributorLine;
					newUser.location = req.params.location;
					if(req.params.admin)
						newUser.admin = req.params.admin;

					newUser.save(function(err){
						if(err){
							console.log('error guardando');
							throw err;
						}
						console.log(newUser.username + ' Registro satisfactorio');
						return done(null, newUser);
					});

				}
			});
	}));

	router
		.route('/users/:user_id')
		.put(function(req, res){
			var query = { _id : req.params.user_id},
				update = {},
				option = { upsert:true };

			if(typeof req.params.name !== 'undefined')
				update.name = req.params.name;

			if(typeof req.params.admin !== 'undefined')
				update.admin = req.params.admin;

			if(typeof req.params.location !== 'undefined')
				update.location = req.params.location;

			if(typeof req.params.role !== 'undefined')
				if(req.params.role.length > 0)
					update.role.push(req.params.role);

			if(typeof req.params.distributorLine !== 'undefined')
				update.distributorLine = req.params.distributorLine;

			distributionLine.findOneAndUpdate(query, update, option, callback);

			function callback(err, doc){
				if(err)
					return res.json({error:true,message:err});
				return res.json({error:false, result:doc});
			};
		})

	router
		.route('/distributionLine/:ln_id')
		.get(function(req, res, next){

			distributionLine.findById(req.params.ln_id, callback);

			function callback(err, doc){
				if(err)
					return res.json({error:true,message:err});
				if(!doc)
					return res.json({error:false, result:'Distributor line no found'});
				else
					return res.json({error:false, result:doc});	
			};
		})
		.post(function(req, res, next){
		
			var newDistributionLine = new distributionLine();

			newDistributionLine.name = req.params.name;
			newDistributionLine.number = req.params.number;
			newDistributionLine.location = req.params.location;
			
			distributionLine.save(callback);

			function callback(err, doc){
				if(err)
					return res.json({error:true,message:err});
				return res.json({error:false, result:doc});
			};
		})
		.put(function(req, res, next){
			var query = { _id : req.params.ln_id},
				update = {},
				option = { upsert:true };

			if(typeof req.params.name !== 'undefined')
				update.name = req.params.name;

			if(typeof req.params.number !== 'undefined')
				update.number = req.params.number;

			if(typeof req.params.location !== 'undefined')
				update.location = req.params.location;

			if(typeof req.params.role !== 'undefined')
				update.role.push(req.params.role);				

			distributionLine.findOneAndUpdate(query, update, option, callback);

			function callback(err, doc){
				if(err)
					return res.json({error:true,message:err});
				return res.json({error:false, result:doc});
			};
		})
		.delete(function(req, res, next){
			var query = { _id : req.params.dl_id };

			distributionLine.remove(query, callback);

			function callback(err){
				if(err)
					return res.json({error:true,message:err});
				return res.json({error:false, result:true});	
			};
		})

	router
		.get('/userByDl', function(req, res, next){
			var query = {_id : req.params._id};

			user
				.find(query)
				.populate('dl')
				.exec(callback);

			function callback(err, doc){
				if(err)
					return res.json({error:true,message:err});
				if(!doc)
					return res.json({error:false, result:'Distributor line no found'});
				else
					return res.json({error:false, result:doc});	
			};
		});

	return router;
};