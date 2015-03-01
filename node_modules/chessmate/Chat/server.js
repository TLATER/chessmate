var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(2000).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err, db){
	if(err)
		throw err;
	client.on('connection', function(socket){
		
		var database = db.collection('messages');
		var sendStatus = function(s){
			socket.emit('status',s);
		};

		database.find().toArray(function(err, response){
			if(err)
				throw err;
			else
				socket.emit('output', response);
		});

		socket.on('input', function(data){
			var name = data.name;
			var message = data.message;
			var whiteSpacePattern = /^\s*$/;
			if(whiteSpacePattern.test(name) || whiteSpacePattern.test(message)){
				sendStatus("Name and message required");
			}
			else{
				database.insert({name : name, message : message}, function(){

				client.emit('output', [data]);
				sendStatus({
					message : "Message was sent",
					clear : true
				});
			});
		}
	});
});
});