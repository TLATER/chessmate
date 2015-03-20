var playing = false;
var gamesSocket = io.connect('/gameRooms');
var lobbySocket = io.connect('/lobbyRooms');

function gamesConnect() {
    var input = document.getElementById('input');
    var output = $('#messages');

    input.onkeypress = function(keypress) {
        if (keypress.keyIdentifier === 'Enter') {
            var text = input.value;
            gamesSocket.emit('send', { message: text });

            input.value = '';
        }
    };

    gamesSocket.on('message', function(data) {
        // If we have a username this message is sent from a user, otherwise
        // from the server. Different css classes for each case.
        var addToChat;
        if (data.username)
            addToChat = "<div class='username'>" + data.username
                         + ':</div>   ' + data.message;
        else
            addToChat = "<div class='serverMessage'>" + data.message + "</div>";

        output.append("<div class='chatMessage'>" + addToChat + "</div>");
        var height = output[0].scrollHeight;
        output.scrollTop(height);
    });

    gamesSocket.on('board', function(data) {
        console.log('Received board');
        console.log(data.board);
        placePiece(data);
    });

    gamesSocket.on('move', function(data) {
        console.log(data.move);
        if (data.move === 'checkmate') {
            var addToChat ="<div class='serverMessage'>The game is over!</div>";
            output.append("<div class='chatMessage'>" + addToChat + "</div>");
        }
        // JSON of the move the client wants to make
        var desiredMove = JSON.parse(data.move);
        var currentPositionID = '#'+desiredMove[0];
        var desiredPositionID = '#'+desiredMove[1];
        var movingPiece = findPiece(currentPositionID)+ " ";

        var color = $(desiredPositionID).hasClass('white')
                                                    ? ' white ' : ' black ';
        $(currentPositionID).toggleClass(movingPiece);
        $(desiredPositionID).removeClass();
        $(desiredPositionID).addClass(movingPiece + color + 'boardCell');

        // For debugging
        var test = $(currentPositionID).hasClass('pawnW');
        console.log('*'+currentPositionID);
        console.log('*'+test);
    });

    gamesSocket.on('players', function(data) {
        console.log(data);
        $('#blackPlayer').html(data.black);
        $('#whitePlayer').html(data.white);
    });

    gamesSocket.on('error', function(data) {
        output.append("<div class='errorMessage'>" + data + "</div>");
    });
}

function lobbyConnect() {
    var input = document.getElementById('lobbyInput');
    var output = $('#lobbyMessages');

    lobbySocket.on('message', function(data) {
        console.log(data);
        if (data.message !== undefined) {

            var addToChat;
            if (data.username)
                addToChat = "<div class='username'>" + data.username
                             + ':</div>   ' + data.message;
            else
                addToChat = "<div class='serverMessage'>"
                             + data.message + "</div>";

            output.append("<div class='chatMessage'>" + addToChat + "</div>");
            var height = output[0].scrollHeight;
            output.scrollTop(height);
        }
    });

    lobbySocket.on('welcome', function(data) {
        console.log(data);
        if (data !== undefined) {
            output.append("<div class='welcomeMessage'>" + data +"</div>");
            var height = output[0].scrollHeight;
            output.scrollTop(height);
        }
    });

    input.onkeypress = function(keypress) {
        if (keypress.keyIdentifier === 'Enter') {
            var text = input.value;

            if (text === '/newGame') {
                if (!playing) {
                    $('#game').toggleClass('hidden');
                    $('#lobby').toggleClass('large');
                    gamesSocket.emit('newGame');
                    playing = true;
                } else {
                    output.append("<div class='chatMessage serverMessage'>"
                                  + "You can't start a new game when you are "
                                  + "already playing.</div>");
                    var height = output[0].scrollHeight;
                    output.scrollTop(height);
                }
            }
            else
                lobbySocket.emit('send', { message: text });

            input.value = '';
        }
    };
}



// Place all pieces from an array in the appropriate cells of the board
function placePiece(data) {
    // Get array of all rows of the board
    var rows = $('.boardRow');
    for (var rowIndex = 0; rowIndex < data.board.length; rowIndex++)
    {
        for (var cellRowIndex = 0;
                 cellRowIndex < data.board[rowIndex].length;
                 cellRowIndex++)
        {
            var cell = rows[rowIndex].children[cellRowIndex];
            var gameBoardCell = data.board[rowIndex][cellRowIndex];
            switch (gameBoardCell) {
                case 'R':
                    $(cell).toggleClass('rookB ');
                    break;
                case 'S':
                    $(cell).toggleClass('knightB ');
                    break;
                case 'B':
                    $(cell).toggleClass('bishopB ');
                    break;
                case 'Q':
                    $(cell).toggleClass('queenB ');
                    break;
                case 'K':
                    $(cell).toggleClass('kingB ');
                    break;
                case 'B':
                    $(cell).toggleClass('bishopB ');
                    break;
                case 'S':
                    $(cell).toggleClass('knightB ');
                    break;
                case 'R':
                    $(cell).toggleClass('rookB ');
                    break;
                case 'P':
                    $(cell).toggleClass('pawnB ');
                    break;

                case 'RW':
                    $(cell).toggleClass('rookW ');
                    break;
                case 'SW':
                    $(cell).toggleClass('knightW ');
                    break;
                case 'BW':
                    $(cell).toggleClass('bishopW ');
                    break;
                case 'QW':
                    $(cell).toggleClass('queenW ');
                    break;
                case 'KW':
                    $(cell).toggleClass('kingW ');
                    break;
                case 'WW':
                    $(cell).toggleClass('WishopW ');
                    break;
                case 'SW':
                    $(cell).toggleClass('knightW ');
                    break;
                case 'RW':
                    $(cell).toggleClass('rookW ');
                    break;
                case 'PW':
                    $(cell).toggleClass('pawnW ');
                    break;
            } // switch
        } // for
    } // for
} // placePiece

// Function to find what chess piece a div may curently have.
function findPiece(id) {
    var pieceClasses = "rookB knightB bishopB queenB kingB pawnB rookW knightW bishopW queenW knightW pawnW".split(" ");
    for (var i = 0; i<pieceClasses.length; i++) {
        if ($(id).hasClass(pieceClasses[i])) {
            console.log("Moving " + pieceClasses[i]);
            return pieceClasses[i];
        } else if (i === 8 && !$(id).hasClass(pieceClasses[i])) {
            console.log("There isn't a piece on " + id);
            //return false;
        } // else
    } // for
} // findPiece

window.onload = function() {
    gamesConnect();
    lobbyConnect();
};