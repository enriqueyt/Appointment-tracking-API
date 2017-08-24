var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var user = mongoose.model('user');
var appointment = mongoose.model('appointment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard/:id', function(req, res){
  var _id = req.params.id;
  var query = {'_id':new ObjectId(_id)}

  user.findById(query).exec()
  .then(function(data, err){
    if(err){
      res.json({success:false, data:err})
      return;
    }    
    query={}
    if(data.role[0].toLowerCase()=='Manage'){
      query={};
    }
    return appointment.find(query).exec();
  })
  .then(function(data){
      var obj={
          citasEfectivas:0,          
          citasPorAtender:0,
          citasAtendidas:0,
          totalCitas:data.length
      },
      objaux;
      for(var i=0; i<data.length;i++){
        objaux=data[i];
        if(objaux.wasAttended&&objaux.products.length>0) obj.citasEfectivas++;
        if(objaux.wasAttended) obj.citasAtendidas++;
      };
      res.json({success:true, data:obj})
  })
});

module.exports = router;
