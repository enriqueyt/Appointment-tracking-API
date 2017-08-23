var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard/:id', function(req, res){
  var _id = rew.params.id;
});

module.exports = router;
