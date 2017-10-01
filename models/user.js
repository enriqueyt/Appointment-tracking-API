var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
	name : String,
	username : {
		type: String,
		required: true,
		unique:true,
		lowercase:true
	},
	password:{
		type : String,
		required : true
	},
	email :{
		type : String
	},
	admin : {
		type : Boolean,
		default : false
	},
	location: {
		type : String
	},
	role : {
		type: [String],
		index:true
	},
	createAt : {
		type: Date,
		default: Date.now
	},
	updateAt : {
		type: Date,
		default : Date.now
	},
	distributorLine : {
		type : Schema.Types.ObjectId,
		ref : 'dl'
	},
	avatar:{
		type:String
	}
});

user.methods.test = function(ed){
	this.name = this.name + ed
	return this.name;
};



module.exports = mongoose.model('user', user);