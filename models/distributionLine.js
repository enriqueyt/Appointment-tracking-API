var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dl = new Schema({
	name : {
		type:String,
		require:true
	},
	number : {
		type:String,
		require:true
	},
	location: String
});

dl.methods.test = function(ed){
	this.name = this.name + ed
	return this.name;
};

module.exports = mongoose.model('distributionLine', dl);