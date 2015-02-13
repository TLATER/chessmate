var moves = new EventSource('/chess-room/users');

moves.on('data', function(message) {
    console.log(message);
});