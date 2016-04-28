var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var reload = require('require-reload')(require);

var app = express();
var http = require('http');
var server = http.createServer(app).listen(3000);
var io = require('socket.io').listen(server);

console.log('server running');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


var data = require('./readLog');
console.log('log.txt loaded');
setInterval(function(){
	try {
      data = reload('./readLog');
    } catch (e) {
      //if this threw an error, the api variable is still set to the old, working version
      console.error("Failed to reload api.js! Error: ", e);
    }
    console.log('log.txt reloaded, from: ' + data.date);
}, 5*60*1000);

/*emit data about which lab computers are available*/
io.sockets.on('connection', function(socket){
  
  socket.on('askForData', function(){
    console.log('data asked for');
    socket.emit('Event', data);
    console.log(data);
  })

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
