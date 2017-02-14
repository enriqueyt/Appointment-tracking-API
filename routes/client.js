var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var client = mongoose.model('client');
var distributionLine = mongoose.model('distributionLine');
var Promise = require('promise');

router
	.route('/:client_id')
	.get(function(req, res, next){

		client.findById(req.params.client_id, callback);

		function callback(err, doc){
			if(err)
				return res.json({error:true,message:err});
			if(!doc)
				return res.json({error:true, message:'client no found'});
			else
				return res.json({error:false, data:doc});	
		};
	})
	.post(function(req, res, next){
	
		var newClient = new client();

		newClient.name = req.body.name;
		newClient.phone = req.body.phone;
		newClient.state = req.body.state;

		if(typeof req.body.locationLat !== 'undefined')
			newClient.locationLat = req.body.locationLat;

		if(typeof req.body.locationLon !== 'undefined')
			newClient.locationLon = req.body.locationLon;

		if(typeof req.body.referred !== 'undefined')
			newClient.referred = req.body.referred;

		newClient.save(callback);

		function callback(err, doc){
			if(err)
				return res.json({error:true, message:err});
			return res.json({error:false, data:doc});
		};
	})
	.put(function(req, res, next){
		var query = { _id : req.params.client_id},
			update = {
				updateAt:Date.now
			},
			option = { upsert:true };

		if(typeof req.body.name !== 'undefined')
			update.name = req.body.name

		if(typeof req.body.state !== 'undefined')
			update.state = req.body.state

		if(typeof req.body.phone !== 'undefined')
			update.phone = req.body.phone

		if(typeof req.body.isRead !== 'undefined')
			update.isRead = req.body.isRead

		client.findOneAndUpdate(query, update, option, callback);

		function callback(err, doc){
			if(err)
				return res.json({error:true,message:err});
			return res.json({error:false, data:doc});
		};
	})
	.delete(function(req, res, next){
		var query = { _id : req.params.client_id };

		client.remove(query, callback);

		function callback(err){
			if(err)
				return res.json({error:true,message:err});
			return res.json({error:false, data:true});	
		};
	})

router
	.get('/complex/list/:isRead/:limit/:skip', function(req, res, next){

		var query = {},
			projection = {};

		if(req.params.isRead)
			query.isRead = req.params.isRead;

		client
			.find(query)
			.populate('client')
			.sort('createAt')
			.select(projection)
			.limit(parseInt(req.params.limit))
			.skip(parseInt(req.params.skip))
			.exec(callback);

		function callback(err, docs){
			if(err)
				return res.json({error:true,message:err});

			var _promise = new Promise(function(resolve, reject){

				var ids = [], cant = 0;

				for(var i = 0, cant = docs.lenght; i < cant; i++ ){
					ids.push(clients._id);				
				}

				var query = { 
						_id : { '$in': ids }
				 	},
					update = { isRead : true }
					option = { multi : true };
				
				client.update(query, update, option, callback);

				function callback(err, numAffects){
					if(err)
						reject(err);
					else
						resolve(numAffects);
				};
			});
			
			_promise
				.then(function(numAffects){
					return res.json({error:false, data:docs});
				})
				.catch(function(err){
					return res.json({error:true, message:err});
				});
		};
	});

router
	.get('/complex/all/:limit/:skip', function(req, res, next){
		var query = {},
			projection = {};

		if(typeof req.body.isRead!== 'undefined')
			query.p_isRead = req.body.isRead;

		if(typeof req.body.name !== 'undefined')
			query.name = req.body.name; 

		if(typeof req.body.state !== 'undefined')
			query.state = req.body.state; 

		if(typeof req.body.createBy !== 'undefined')
			query.createBy = req.body.createBy; 

		if(typeof req.body.referred !== 'undefined')
			query.referred = req.body.referred; 

		if(typeof req.body.createAt == 'undefined')
			projection.createAt = 1;

		if(typeof req.body.p_isRead== 'undefined')
			projection.isRead = 1;

		if(typeof req.body.p_name== 'undefined')
			projection.name = 1;

		if(typeof req.body.p_state == 'undefined')
			projection.state = 1;

		if(typeof req.body.p_referred == 'undefined')
			projection.referred = 1;

		if(typeof req.body.p_createBy == 'undefined')
			projection.createBy = 1;

		if(typeof req.body.p_createAt == 'undefined')
			projection.createAt = 1; 

		if(typeof req.body.sendBy == 'undefined')
			projection.sendBy = 1;

		client
			.find(query)
			.sort({createAt:-1})
			.limit(parseInt(req.params.limit))
			.skip(parseInt(req.params.skip))
			.exec(callback);

		function callback(err, docs){
			if(err)
				return res.json({ error:true, message:err });

			if(!docs)
				return res.json();

			return res.json({error:false, data:docs});

		};
	});

router
	.get('/findReferredClient/:client_id', function(req, res, next){

		var query = { _id : req.params.client_id }

		client
			.find(query)
			.populate('client')
			.exec(callback)

		function callback(err, docs){
			if(err)
				return res.json({ error:true, message:err });

			if(!docs)
				return res.json();

			return res.json({error:false, data:docs});

		};
	})
		
module.exports = router;
