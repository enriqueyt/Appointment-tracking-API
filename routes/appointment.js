var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var appointment = mongoose.model('appointment');
var ObjectId = require('mongoose').Types.ObjectId; 


router
	.route('/:appointment_id')
	.get(function(req, res, next){

		appointment
			.findById(req.params.appointment_id)
			.populate('createBy')
			.populate('client')
			.exec(callback);

		function callback(err, appointment){
			if(err)
				return res.json({ error:true, message:err });
			if(!appointment)
				return res.json({ error:true, message:'appointment is no longer exist' });

			return res.json({ error:false, result:appointment });
		};
	})
	.post(function(req, res, next){

		var newAppointment = new appointment();

		newAppointment.assignedTo = req.body.assignedTo;
		newAppointment.client = req.body.client;	
		newAppointment.description = req.body.description;		
		newAppointment.appointmentDate = req.body.appointmentDate;
		newAppointment.address = req.body.address;

		if(typeof req.body.is_client != 'undefined')
			newAppointment.is_client = req.body.is_client;
		
		if(typeof req.body.location != 'undefined')
			newAppointment.location = req.body.location;
			
		if(typeof req.body.products != 'undefined')
			newAppointment.products.push(req.body.products);
		
		newAppointment.save(function(err, doc){
			if(err)
				return res.json({ error:true, message:err });
			return res.json({ error:false, data:doc })
		});
	})
	.put(function(req, res, next){
		var ObjectId = require('mongoose').Types.ObjectId;
		
		var query = { "_id" : new ObjectId(req.params.appointment_id) },			
			option = { upsert:true };
		
		appointment.findOne(query, callback);

		function callback(err, doc){
			
			if(err || !doc){
				return res.json({ error:true, message:'No exite el documento' });
			}

			if(typeof req.body.description !== 'undefined')
				doc.description = req.body.description

			if(typeof req.body.is_client !== 'undefined')
				doc.is_client = req.body.is_client

			if(typeof req.body.wasAttended !== 'undefined')
				doc.wasAttended = req.body.wasAttended

			if(typeof req.body.howWasAppointment !== 'undefined')
				doc.howWasAppointment = req.body.howWasAppointment

			if(typeof req.body.location != 'undefined'){			
				doc.location = req.body.location;
			}
			
			if(typeof req.body.products !== 'undefined'){
				doc.products = req.body.products;
			}
			
			if(typeof req.body.address !== 'undefined'){
				doc.address = req.body.address;
			}

			doc.save();

			return res.json({ error:false, data:doc });
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
	.put('/reassignedAppointment/:id/:newDate', function(req, res){

		var query = {
				_id : new ObjectId(req.params.id)
			},
			update = {
				reAssigned : true,
				appointmentDate : new Date(req.body.newDate)
			},
			option = { upsert:true };

		client.findOneAndUpdate(query, update, option, callback);

		function callback(err, doc){
			if(err)
				return res.json({ error:true, message:err });
			return res.json({ error:false, result:doc });
		};
	});

router
	.get('/list/:by/:value', function(req, res, next){
 
		var aux = req.params.by;
		var query = { 
			aux : req.params.value 
		};

		appointment.find(query, function(err, doc){
			if(err)
				return res.json({ error:false, message:err });
			return res.json({ error:true, result:doc });
		});
	});

router
	.get('/allAppointments/:limit/:skip', function(req, res, next){
		var query = {},
			projection = {};

		if(typeof req.body.is_client!== 'undefined')
			query.is_client = req.body.is_client;

		if(typeof req.body.wasAttended !== 'undefined')
			query.wasAttended = req.body.wasAttended; 

		if(typeof req.body.wasAttended !== 'undefined')
			query.wasAttended = req.body.wasAttended; 

		if(typeof req.body.createBy !== 'undefined')
			query.createBy = req.body.createBy; 

		if(typeof req.body.client !== 'undefined')
			query.client = req.body.client; 

		if(typeof req.body.appointmentDate !== 'undefined')
			query.appointmentDate = req.body.appointmentDate; 

		if(typeof req.body.p_is_client== 'undefined')
			projection.is_client = 1;

		if(typeof req.body.p_wasAttended == 'undefined')
			projection.wasAttended = 1;

		if(typeof req.body.p_wasAttended == 'undefined')
			projection.wasAttended = 1;

		if(typeof req.body.p_createBy == 'undefined')
			projection.createBy = 1;

		if(typeof req.body.p_client == 'undefined')
			projection.client = 1;

		if(typeof req.body.appointmentDate == 'undefined')
			query.appointmentDate = 1;
	
		appointment
			.find({})
			.sort({appointmentDate:1})
			.populate('client')
			.populate('assignedTo')
			.limit(parseInt(req.params.limit))
			.skip(parseInt(req.params.skip))
			.exec(callback);

		function callback(err, docs){
			if(err)
				return res.json({ error:true, message:err });

			if(!docs)
				return res.json({ error:true, message:'No existe!'});

			return res.json({error:false, data:docs});

		};
	});

router
	.get('/appointments/byUser/:createBy/:limit/:skip', function(req, res, next){

		var query = { assignedTo : new ObjectId(req.params.createBy) },
			sort = { appointmentDate : 1 },
			limit = parseInt(req.params.limit),
			skip =  parseInt(( req.params.skip > 0 ? (( req.params.skip - 1 ) * req.params.limit ) : 0 ));

		appointment
			.find(query)
			.populate('client')
			.limit(limit)
			.sort({appointmentDate:1})
			.skip(skip)
			.exec(callback);

			function callback(err, result){
				if(err)
					return res.json({ error:true, message:err });
				return res.json({ error:false, data:result });
			};
	});

router
	.get('/appointmentsUserByDay/:createBy/:date/:skip/:limit', function(req, res, next){

		var query = { assignedTo : new ObjectId(req.params.createBy) },
			sort = { appointmentDate : 1 },
			time = new Date(),
			today = new Date(time.getDate(), time.getMonth(), time.getFullYear())

			if(typeof req.params.date != 'undefined')
				query.appointmentDate = { 
					appointmentDate : { 
						'$gt' : today 
					} 
				}

		appointment
			.aggregate([
					{ $match : query },
					{ $sort : sort },
					{ $limit : req.params.limit },
					{ $skip : req.params.skip }
				],
				function(err, result){
					if(err)
						return res.json({ error:true, message : err });
					return res.json({ error:false, return:result });
				});
	});

router
	.get('/groupByuser/:_id/:attended', function(req, res, next){

		var obj = { 
			/*$month : typeof req.params.date !== 'undefined' ? new Date(req.params.date).getMonth() : new Date().getMonth()*/
		}
		
		var query = 
			[{ 
				$match : {
					assignedTo : new ObjectId(req.params._id)
				}
			},{
				$group : {
					_id : '$wasAttended',
					count : { 
						$sum : 1 
					}
				}
			}];

		appointment
			.aggregate(query, 
				function(err, doc){
					if(err)
						return res.json({ error:true, message:err });
					return res.json({ error:false, data:doc });
				});
	});


module.exports = router;