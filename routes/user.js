var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user');
var role = mongoose.model('roles');
var bCrypt = require('bcrypt-nodejs');

router
	.route('/:id')
	.get(function(req, res, next){

		var query = { _id : req.params.id},
			sort = { _id : 1 };			

		user
			.aggregate([
				{
					$match : query
				},
				{ 
					$sort : sort 
				}
			], 
			function(err, result){
				if(err)
					return res.json({ error:true, message:err });
				return res.json({ error:false, data:result });
			});
	})
	.post(function(req, res, next){

		var newUser = new user();

		newUser.name 		= req.body.name;
		newUser.username 	= req.body.username;
		newUser.password 	= bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
		
		if(typeof req.body.description!=='undefined'){
			newUser.email = req.body.description;
		}

		if(typeof req.body.email!=='undefined'){
			newUser.email = req.body.email;
		}

		if(typeof req.body.admin!=='undefined'){
			newUser.admin = req.body.admin;
		}
		
		if(typeof req.body.location!=='undefined'){
			newUser.location=req.body.location;
		}

		if(typeof req.body.avatar!=='undefined'){
			newUser.avatar=req.body.avatar;
		}

		if(typeof req.body.role != 'undefined')
			newUser.role.push(req.body.role);
		
		if(typeof req.body.distributorLine != 'undefined')
			newUser.distributorLine = req.body.distributorLine;

		newUser.save(function(err, doc){
			if(err)
				return res.json({ error:true, message:err });
			return res.json({ error:false, data:doc })
		});
	})
	.put(function(req, res, next){

		var query = { _id : req.params.id },
			update = {},
			option = { upsert:true };

		if(typeof req.body.name !== 'undefined')
			update.name = req.body.name;

		if(typeof req.body.username !== 'undefined')
			update.username = req.body.username;

		if(typeof req.body.description !== 'undefined')
			update.description = req.body.description;

		if(typeof req.body.password !== 'undefined')
			update.password = req.body.password;

		if(typeof req.body.email != 'undefined')
			update.email = req.body.email;

		if(typeof req.body.admin != 'undefined')
			update.admin = req.body.admin;

		if(typeof req.body.location != 'undefined')
			update.location = req.body.location;

		if(typeof req.body.role != 'undefined')
			update.role = req.body.role;

		if(typeof req.body.distributorLine != 'undefined')
			update.distributorLine = req.body.distributorLine;

		user.findOneAndUpdate(query, update, option, callback);

		function callback(err, doc){
			if(err)
				return res.json({ error:true, message:err });
			return res.json({ error:false, data:doc });
		};
	})
	.delete(function(req, res, next){
		var query = { _id : req.params.id };

		user.remove(query, callback);

		function callback(err){
			if(err)
				return res.json({ error:true, message:err });
			return res.json({ error:false, data:true });	
		};
	});

router
	.get('/ByDl/:id', function(req, res, next){
		var query = {_id : req.params.id};

		user
			.find(query)
			.populate('dl')
			.exec(callback);

		function callback(err, doc){
			if(err)
				return res.json({error:true,message:err});
			if(!doc)
				return res.json({error:false, message:'Distributor line no found'});
			else
				return res.json({error:false, data:doc});	
		};
	});

router
	.get('/:limit/:skip', function(req, res) {

		var sort = { _id : 1 },
			limit = parseInt(req.params.limit),
			skip =  parseInt(( req.params.skip > 0 ? (( req.params.skip - 1 ) * req.params.limit ) : 0 ))

		user
			.aggregate([
				{ 
					$sort : sort 
				},
				{ 
					$skip : skip
				},
				{ 
					$limit :  limit
				}
			], 
			function(err, result){
				if(err)
					return res.json({ error:true, message:err });
				return res.json({ error:false, data:result });
			});
	});

router
	.route('/role/list/:id')
	.get(function(req, res){
		role
			.find({}, function(err, data){				
				console.log(data)
				console.log(err)
				if(err)
					return res.json({ error:true, message:err });
				return res.json({ error:false, data:data});
			})
	})
	.post(function(req, res){
		var newRole = new role();

		newRole.name = req.body.name;		
		newRole.active 	= req.body.active;		

		newRole.save(function(err, doc){
			if(err)
				return res.json({ error:true, message:err });
			return res.json({ error:false, data:doc })
		});
	})
	.delete(function(req, res){
		var query = { _id : req.params.id };

		user.remove(query, callback);

		function callback(err){
			if(err)
				return res.json({ error:true, message:err });
			return res.json({ error:false, data:true });	
		};
	});

router.post('/user/seed',function(req, res){

	var newUser = new user();

	newUser.name 		= req.body.name;
	newUser.username 	= req.body.username;
	newUser.description = req.body.description;
	newUser.password 	= req.body.password;
	newUser.email 		= req.body.email;
	newUser.admin 		= req.body.admin;
	newUser.location 	= req.body.location;

	if(typeof req.body.role != 'undefined')
		newUser.role.push(req.body.role);
	
	if(typeof req.body.distributorLine != 'undefined')
		newUser.distributorLine = req.body.distributorLine;

	newUser.save(function(err, doc){
		if(err)
			return res.json({ error:true, message:err });
		return res.json({ error:false, data:doc })
	});
	
});

module.exports = router;	