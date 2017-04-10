var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contactus', { title: 'Contact Us' });
  //res.send('UERS Page respond with a resource');
});

module.exports = router;