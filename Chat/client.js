window.onload = function(){
	var getNode = function(s){
		return document.querySelector(s);
	};

	 var textArea = getNode('.chat-textarea');
	 var status = getNode('.chat-status span');
	 var messages = getNode('.chat-messages');
	 var chatName = getNode('.chat-name');
	 
	 var defaultStatus = status.textContent;
	 console.log(defaultStatus);
	 
	 var setStatus = function(s){
	 	status.textContent = s;
	 	if(s !== defaultStatus)
	 	{
	 		var delay = setTimeout(function(){
	 		setStatus(defaultStatus);
	 		clearInterval(delay);
	 		}, 3000);
	 	}
	 };
	
	try{
		var socket = io.connect('http://127.0.0.1:2000');
	}
	catch(e){}

	if(socket !== undefined){
		socket.on('output', function(receivedData){
			if(receivedData.length){
				for(var i = 0; i < receivedData.length; ++i){
					var message = document.createElement('div');
					message.setAttribute('class', 'chat-message');
					message.textContent = receivedData[i].name + ": " + receivedData[i].message; 
					messages.appendChild(message);
					messages.insertBefore(message, messages.firstChild);
				}
			}
		});

		socket.on('status', function(receivedData){
			setStatus((typeof receivedData === 'object') ? receivedData.message : receivedData);

			if(receivedData.clear === true)
				textArea.value = "";
		});

		textArea.addEventListener('keydown', function(event){
			var userName = chatName.value;
			if(event.which === 13 && event.shiftKey === false){
				socket.emit('input',{
					name : userName,
					message : this.value
				});
			event.preventDefault();
			}
		});
	}
}