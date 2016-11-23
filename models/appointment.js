var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var appointment = new Schema({
	createBy : {
		type : Schema.Types.ObjectId,
		ref : 'user'
	},
	client : {
		type : Schema.Types.ObjectId,
		ref : 'client'
	},
	location : {
		type : [String],
		index : true
	},
	appointmentDate : {
		type: Date,
		require:true
	},
	description : String,
	is_client : {
		type : Boolean,
		default : false
	},
	products : {
		type : [String],
		index : true
	},
	wasAttended : {
		type : Boolean,
		default : false
	},
	reAssigned : {
		type : Boolean,
		default : false
	},
	howWasAppointment : {
		type : String
	}
});

appointment.methods.find = function(ed){
	this.name = this.name + ed
	return this.name;
};

module.exports = mongoose.model('appointment', appointment);