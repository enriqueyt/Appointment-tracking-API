var express = require('express');
var router = express.Router();


module.exports = function(passport){

	
	router.post('/login', function(req, res, next){

		passport.authenticate('login', function(err, user, info){
			console.log(err)
			if(err){
				res.json({
					success : !err,
					message : info
				});

				return;
			};
				
			res.json({
				success : true,
				doc : {
					id : user._id, 
					admin:user.admin,
					name:user.name
				},
				info : info
			});
		})(req, res, next)

	});

	router.post('/signup', function(req, res, next){

		passport.authenticate('signup', function(err, user, info){

			res.json({
				success : (!err ? true : false),
				doc : user,
				info : info
			});
		})(req, res, next)

	});

	router.get('signout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	return router;

};