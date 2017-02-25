var express = require('express');
var router = express.Router();


module.exports = function(passport){

	
	router.post('/login', function(req, res, next){

		passport.authenticate('login', function(data){
			
			if(data.error){
				res.json({
					success : !data.error,
					message : data.message
				});

				return;
			};

			res.json({
				success : true,
				data : {
					id : data.data._id, 
					admin:data.data.admin,
					name:data.data.name,
					role:data.data.role,
					distributionLine:data.data.distributorLine
				},
				info : data.message
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