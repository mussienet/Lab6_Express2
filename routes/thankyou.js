var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('thankyou', { title: 'Thank You' });
  //res.send('UERS Page respond with a resource');
});

module.exports = router;