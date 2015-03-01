var moves = new EventSource('/chess-room/users');

moves.addEventListener('message', function(message) {
    console.log(message);
});