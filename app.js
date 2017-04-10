var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var requestIp = require('request-ip');  //what I added
var fs = require('fs');   //what I added
var csrf = require('csurf');    //what I added

var csrfProtection = csrf({ cookie: true })
  , cookieParser = require('cookie-parser')
  , cookieSession = require('cookie-session');

var index = require('./routes/index');
var users = require('./routes/users');
var contactus = require('./routes/contactus');
//var contactus = require('./routes/thankyou');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());

//app.use(csrf());    //what I added
//app.use(app.router);    //what I added

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestIp.mw());  //what I added
//app.use(csurf());    //what I added
// app.use(function(req,res,next){     //what I added
//   res.locals.csrftoken = req.csrftoken();
//   next();
// });

var urlencodedParser = bodyParser.urlencoded({ extended: false }) //what I added

app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/contactus', contactus);
//app.use('/thankyou', thankyou);

app.post('/contactus', urlencodedParser, function (req, res) {  //what I added
  if (!req.body) return res.sendStatus(400)
  var errors = [];

  console.log("fisrtname: "+req.body.firstname);
  console.log("comment: "+req.body.comment);
  if(!req.body.firstname) errors.push({msg:'First name is required'});
  if(!req.body.comment) errors.push({msg:'Give us your comments, Please?'});
  if(errors) {
    res.render('thankyou',{errors:errors, username: req.body.firstname});
  }
  if(errors.length==0){
        var clientIp = requestIp.getClientIp(req); 
        console.log('the user\'s ip address is:'+clientIp);
        res.render('thankyou', { username: req.body.firstname, errors:errors});

      function comment(fname, commentOpt, commentBody, ip){
        this.fname = fname;
        this.commentOpt = commentOpt;
        this.commentBody = commentBody;
        this.ipaddress = ip;
      }
      var comObj = new comment(req.body.firstname,req.body.opt,req.body.comment,clientIp);
      writetoFile(comObj);
  }


})

app.get('/contactus', csrfProtection, function(req, res) {      //what I added
  // pass the csrfToken to the view
  console.log('my token is ===>: '+req.csrfToken());
  res.render('contactus', { csrfToken: req.csrfToken()});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function writetoFile(commentObj){
  var text="";
  text= 'First name: '+commentObj.fname;
  text+= '\r\t Comment Type: '+commentObj.cmmtOpt;
  text+= '\r\t Comment: '+commentObj.commentBody;
  text+= '\r\t User\'s IP Address: '+commentObj.ipaddress;
  text+='\r\n';
  
  fs.appendFile(__dirname +'/Lab6_outputFile.txt', text, encoding='utf8', function (err) {
    if (err) throw err;
  });
}

app.listen(8080, function(){
  //  console.log('Trial server');
});

module.exports = app;

//we can access on the browser using localhost:8080/contactus
