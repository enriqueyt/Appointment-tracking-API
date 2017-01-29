var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var distributionLine = mongoose.model('distributionLine');

router
	.route('/:ln_id')
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

		newDistributionLine.name = req.body.name;
		newDistributionLine.number = req.body.number;
		newDistributionLine.location = req.body.location;
		
		newDistributionLine.save(callback);

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
	});

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
	});

router
	.route('/:limit/:skip')
	.get(function(req, res){

		var sort = { _id : 1 },
			limit = parseInt(req.params.limit),
			skip =  parseInt(( req.params.skip > 0 ? (( req.params.skip - 1 ) * req.params.limit ) : 0 ))

		distributionLine
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
					return res.json({ error:false, return:result });
				});

	});

module.exports = router;