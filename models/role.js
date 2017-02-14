var moongose = require("mongoose");
var Schema = moongose.Schema;

var roles = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    active:{
        type:Boolean,
        required:true
    }
});

module.exports = moongose.model("roles", roles);