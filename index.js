var express = require('express');
var app = express();
var port = 3000;

var path = require('path');
var mainPath = path.resolve(__dirname, '../');
app.use(express.static(__dirname));

app.get("/", function(req, res) {
	res.sendFile(mainPath + '/index.html');
});

var io = require('socket.io').listen(app.listen(port, function() {
	console.log("listening on port " + port);
}));

io.sockets.on('connection', function (socket) {

	// Add this after we get their name
    socket.broadcast.emit('message', {message: 'A user connected'});
  
	socket.emit('message', { message: '<i>Connected to chat</i>' });
	
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

/*
var http = require('http').Server(app);
var path = require('path');
var mainPath = path.resolve(__dirname, '../');
var io = require('socket.io')(http);
//app.use(express.static(mainPath + '/js'));
//app.use(express.static(mainPath + '/css'));
app.use(express.static(__dirname));

app.get('/', function(request, response){
  response.sendFile(mainPath + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function() {
	console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
	 console.log(msg);
     io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});
*/