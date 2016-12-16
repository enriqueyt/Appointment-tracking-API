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
				return res.json({error:false, result:'client no found'});
			else
				return res.json({error:false, result:doc});	
		};
	})
	.post(function(req, res, next){
	
		var newClient = new client();

		newClient.name = req.params.name;
		newClient.state = 'active';
		newClient.phone = req.params.phone;

		if(typeof req.params.location !== 'undefined')
			newClient.location.push(req.params.location);

		if(typeof req.params.referred !== 'undefined')
			newClient.referred = req.params.referred;

		client.save(callback);

		function callback(err, doc){
			if(err)
				return res.json({error:true, message:err});
			return res.json({error:false, result:doc});
		};
	})
	.put(function(req, res, next){
		var query = { _id : req.params.client_id},
			update = {
				updateAt:Date.now
			},
			option = { upsert:true };

		if(typeof req.params.name !== 'undefined')
			update.name = req.params.name

		if(typeof req.params.state !== 'undefined')
			update.state = req.params.state

		if(typeof req.params.phone !== 'undefined')
			update.phone = req.params.phone

		if(typeof req.params.isRead !== 'undefined')
			update.isRead = req.params.isRead

		client.findOneAndUpdate(query, update, option, callback);

		function callback(err, doc){
			if(err)
				return res.json({error:true,message:err});
			return res.json({error:false, result:doc});
		};
	})
	.delete(function(req, res, next){
		var query = { _id : req.params.client_id };

		client.remove(query, callback);

		function callback(err){
			if(err)
				return res.json({error:true,message:err});
			return res.json({error:false, result:true});	
		};
	})

router
	.get('/complex/list/:isRead', function(req, res, next){

		var query = {},
			projection = {};

		if(req.params.isRead)
			query.isRead = req.params.isRead;

		client
			.find(query)
			.populate('client')
			.sort('createAt')
			.select(projection)
			.limit(req.params.limit)
			.skip(req.params.skip)
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
					return res.json({error:false, result:docs});
				})
				.catch(function(err){
					return res.json({error:true, message:err});
				});
		};
	})

router
	.get('/complex/all/:limit/:skip', function(req, res, next){
		var query = {},
			projection = {};

		if(typeof req.params.isRead!== 'undefined')
			query.p_isRead = req.params.isRead;

		if(typeof req.params.name !== 'undefined')
			query.name = req.params.name; 

		if(typeof req.params.state !== 'undefined')
			query.state = req.params.state; 

		if(typeof req.params.createBy !== 'undefined')
			query.createBy = req.params.createBy; 

		if(typeof req.params.referred !== 'undefined')
			query.referred = req.params.referred; 

		if(typeof req.params.createAt !== 'undefined')
			projection.createAt = 1;

		if(typeof req.params.p_isRead!== 'undefined')
			projection.isRead = 1;

		if(typeof req.params.p_name!== 'undefined')
			projection.name = 1;

		if(typeof req.params.p_state !== 'undefined')
			projection.state = 1;

		if(typeof req.params.p_referred !== 'undefined')
			projection.referred = 1;

		if(typeof req.params.p_createBy !== 'undefined')
			projection.createBy = 1;

		if(typeof req.params.p_createAt !== 'undefined')
			projection.createAt = 1;

		client
			.find(query)
			.sort('createAt')
			.select(projection)
			.limit(req.params.limit)
			.skip(req.params.skip)
			.exec(callback);

		function callback(err, docs){
			if(err)
				return res.json({ error:true, message:err });

			if(!docs)
				return res.json();

			return res.json({error:false, result:docs});

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

			return res.json({error:false, result:docs});

		};
	})
		
module.exports = router;
