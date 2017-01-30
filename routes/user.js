var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user');

router
	.route('/:id/:limit/:skip')
	.get(function(req, res, next){

		var query = { _id : req.params.id},
			sort = { _id : 1 },
			limit = parseInt(req.params.limit),
			skip =  parseInt(( req.params.skip > 0 ? (( req.params.skip - 1 ) * req.params.limit ) : 0 ))

		user
			.aggregate([
				{
					$match : query
				},
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
	})
	.post(function(req, res, next){

		var newUser = new user();

		newUser.createBy = req.params.user_id;
		newUser.client_id = req.params.client_id;
		newUser.description = req.params.description;
		newUser.is_client = req.params.is_client;
		newUser.appointmentDate = req.params.appointmentDate;

		if(typeof req.params.products != 'undefined')
			newAppointment.products.push(req.params.products);

		newUser.save(function(err, doc){
			if(err)
				return res.json({ error:false, message:err });
			return res.json({ error:true, message:doc })
		});
	})
	.put(function(req, res, next){

		var query = { _id : req.params.appointment_id },
			update = {},
			option = { upsert:true };

		if(typeof req.params.description !== 'undefined')
			update.description = req.params.description

		if(typeof req.params.is_client !== 'undefined')
			update.is_client = req.params.is_client

		if(typeof req.params.wasAttended !== 'undefined')
			update.wasAttended = req.params.wasAttended

		if(typeof req.params.howWasAppointment !== 'undefined')
			update.howWasAppointment = req.params.howWasAppointment

		if(typeof req.params.location != 'undefined'){
			if(req.params.location.length > 0 )
				update.location.push(req.params.location);
		}

		client.findOneAndUpdate(query, update, option, callback);

		function callback(err, doc){
			if(err)
				return res.json({ error:true, message:err });
			return res.json({ error:false, result:doc });
		};
	})
	.delete(function(req, res, next){
		var query = { _id : req.params.appointment_id };

		client.remove(query, callback);

		function callback(err){
			if(err)
				return res.json({ error:true, message:err });

			return res.json({ error:false, result:true });	
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
				return res.json({error:false, result:'Distributor line no found'});
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

module.exports = router;