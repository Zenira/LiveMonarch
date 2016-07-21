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

// Sets up the router for getting user info from the database
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

// Sets up the router for adding an order
app.get('/orders', function(req, res) {
	var db = monk('localhost:27017/liveMonarch');
    var collection = db.get('order');
	var amount = req.query.amount;
	var type = req.query.type;
	var share = req.query.share;
	var note = req.query.note;
	
	var newOrder = {
		seed_amount: amount,
		seed_type: type,
		seed_share: share,
		note: note
	};
	collection.insert(newOrder, function() {
		res.send({
			complete: true
		});
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