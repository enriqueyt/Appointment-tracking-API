var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var appointment = mongoose.model('appointment');

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
				return res.json({ error:false, message:'appointment is no longer exist' });

			return res.json({ error:true, result:appointment });
		};
	})
	.post(function(req, res, next){

		var newAppointment = new appointment();

		newAppointment.createBy = req.params.user_id;
		newAppointment.client_id = req.params.client_id;

		if(typeof req.params.location != 'undefined')
			newAppointment.location.push(req.params.location);

		newAppointment.description = req.params.description;
		newAppointment.is_client = req.params.is_client;
		newAppointment.appointmentDate = req.params.appointmentDate;

		if(typeof req.params.products != 'undefined')
			newAppointment.products.push(req.params.products);

		newAppointment.save(function(err, doc){
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

route
	.put('/reassignedAppointment/:id/:newDate', function(req, res){
		var query = {
				_id : req.params.id
			},
			update = {
				reAssigned : true,
				appointmentDate : new Date(req.params.newDate)
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

		var query = { req.params.by : req.params.value }

		appointment.find(query, function(err, doc){
			if(err)
				return res.json({ error:false, message:err });
			return res.json({ error:true, result:doc });
		});
	});

router
	.get('/allAppointments', function(req, res, next){
		var query = {},
			projection = {};

		if(typeof req.params.is_client!== 'undefined')
			query.is_client = req.params.is_client;

		if(typeof req.params.wasAttended !== 'undefined')
			query.wasAttended = req.params.wasAttended; 

		if(typeof req.params.wasAttended !== 'undefined')
			query.wasAttended = req.params.wasAttended; 

		if(typeof req.params.createBy !== 'undefined')
			query.createBy = req.params.createBy; 

		if(typeof req.params.client !== 'undefined')
			query.client = req.params.client; 

		if(typeof req.params.appointmentDate !== 'undefined')
			query.appointmentDate = req.params.appointmentDate; 

		if(typeof req.params.p_is_client!== 'undefined')
			projection.is_client = 1;

		if(typeof req.params.p_wasAttended !== 'undefined')
			projection.wasAttended = 1;

		if(typeof req.params.p_wasAttended !== 'undefined')
			projection.wasAttended = 1;

		if(typeof req.params.p_createBy !== 'undefined')
			projection.createBy = 1;

		if(typeof req.params.p_client !== 'undefined')
			projection.client = 1;

		if(typeof req.params.appointmentDate !== 'undefined')
			query.appointmentDate = 1;
	
		appointment
			.find(query)
			.sort('appointmentDate')
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
	.get('/appointmentsByUser/:createBy/:skip/:limit', function(req, res, next){

		var query = { createBy : req.params.createBy },
			sort = { appointmentDate : 1 }

		appointment
			.aggregate([
					{ $match : query },
					{ $sort : sort },
					{ $limit : req.params.limit },
					{ $skip : req.params.skip }
				], 
				function(err, result){
					if(err)
						return res.json({ error:true, message:err });
					return res.json({ error:false, return:result });
				});
	});

router
	.get('/appointmentsUserByDay/:createBy/:date/:skip/:limit', function(req, res, next){

		var query = { createBy : req.params.createBy },
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
	.get('/groupByuser/:user_id/:date/:attended', function(req, res, next){

		var obj = { 
			id : req.params.user_id,
			$month : typeof req.params.date !== 'undefined' ? new Date(req.params.date).getMonth() : new Date().getMonth()
		}

		if(typeof req.params.attended !== 'undefined')
			obj.wasAttended = req.params.attended;

		var query = { 
				$match : obj
			};

		appointment
			.aggregate([
					query,
					{
						$group : {
							_id : '$createBy',
							count : { 
								$sum : 1 
							}
						} 
					}
				], 
				function(err, doc){
					if(err)
						return res.json({ error:true, message:err });
					return res.json({ error:false, return:result });
				});
	});

module.exports = router;