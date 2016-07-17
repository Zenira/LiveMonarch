var express = require('express');
var app = express();
var port = 3000;

var mongo = require('mongodb');
var monk = require('monk');

var path = require('path');
var mainPath = path.resolve(__dirname, '../');
app.use(express.static(__dirname));

app.get("/", function(req, res) {
	res.sendFile(mainPath + '/index.html');
});

app.get('/users/:username', function(req, res) {
	var db = monk('localhost:27017/liveMonarch');
    var collection = db.get('user');
	var un = req.query.username.toLowerCase();
	
	collection.find({username: un}, function(err, items){
		if (items !== undefined) {
			res.send({
				privilege: items[0].privilege_level
			});
		} else {
			res.send({
				privilege: "none"
			});
		}
		db.close();
	});
});

var io = require('socket.io').listen(app.listen(port, function() {
	console.log("listening on port " + port);
}));

io.sockets.on('connection', function (socket) {
	var un = socket.handshake.query.userName;

	// Broadcast user connect message to all but person connecting
    socket.broadcast.emit('message', {message: '<i>['+un+'] connected</i>'});
  
	// Send connected message to person connecting
	socket.emit('message', { message: '<i>Connected to chat</i>' });
	
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
	
	socket.on('disconnect', function() {
		console.log('['+un+'] disconnected');
	});
});

module.exports = app;