var express = require('express');
var app = express();
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

http.listen(3000, function(){
  console.log('listening on *:3000');
});