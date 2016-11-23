var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var client = new Schema({
	name : String,
	state : String,
	location: [],
	referred : {
		type:String,
		ref:'client'		
	},
	createAt : {
		type: Date,
		default: Date.now
	},
	updateAt : {
		type: Date,
		default: Date.now
	},
	phone:{
		type: String
	},
	isRead : {
		type: Boolean,
		default: false,
		index:true
	}
});

client.methods.test = function(ed){
	this.name = this.name + ed
	return this.name;
};



module.exports = mongoose.model('client', client);