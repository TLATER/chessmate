window.onload = function() {
    var socket = io.connect('/');
    var input = document.getElementById('input');
    var output = $('#messages');

    input.onkeypress = function(keypress) {
        if (keypress.keyIdentifier === 'Enter') {
            var text = input.value;
            socket.emit('send', { message: text });

            input.value = '';
        }
    };
    
    // Making boardCell clickable
    // $('.boardCell').click( function() {
    //     $(this.id).toggle("highlight");
    // });

    socket.on('message', function(data) {
        
        // Function to find what chess piece a div may curently have.
        function findPiece(id) {
            var pieceClasses = "rookB knightB bishopB queenB kingB pawnB rookW knightW bishopW queenW knightW pawnW".split(" ");
            for (var i = 0; i<pieceClasses.length; i++) {
                if ($(id).hasClass(pieceClasses[i])) {
                    console.log("Moving " +pieceClasses[i]);
                    return pieceClasses[i];
                } else {
                    console.log("There isn't a piece on " + id);
                    return false;
                }
            } // for
        } // findPiece

        // Add the logic that interprets a move from the server here.
        if (data.move) {
            console.log(data.move);
            // JSON of the move the client wants to make
            var desiredMove = JSON.parse(data.move);
            var currentPositionID = '#'+desiredMove[0];
            var desiredPositionID = '#'+desiredMove[1];
            var movingPiece = findPiece(currentPositionID)+ " ";
            $(currentPositionID).toggleClass(movingPiece);
            $(desiredPositionID).toggleClass(movingPiece);
            
            // For debugging
            var test = $(currentPositionID).hasClass('pawnW');
            console.log(currentPositionID);
            console.log(test);
        }

        function placePiece() {
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


        // Add the logic that loads the board from the server here.
        if (data.board) {
            placePiece();
            console.log(data.board);
        }

        // Add any logic that interprets chat messages here (might be some
        // formatting later on)
        if (data.message !== undefined) {
            output.append("<div class='chatMessage'>" + data.message +"</div>");
            var height = output[0].scrollHeight;
            output.scrollTop(height);
            console.log(data.message);
        }
    });
    lobbyConnect();
};
