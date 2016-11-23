var express = require('express');
var router = express.Router();


module.exports = function(passport){

	router.get('/success', function(req, res){
		console.log('/success req')
		console.log(req)
		res.json({
			state : 'success',
			user : req.user ? req.user : null
		});
	});

	router.post('/failure', function(req, res){
		res.json({
			state : 'success',
			user : req.user ? req.user : null
		});
	});

	router.post('/login', 
		passport.authenticate('login', {
			successRedirect : '/auth/success',
			failureRedirect : '/auth/failure'
		}));

	router.post('/signup', 
		passport.authenticate('signup', {
			successRedirect : '/auth/success',
			failureRedirect : '/auth/failure'
		}));

	router.get('signout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	return router;

};