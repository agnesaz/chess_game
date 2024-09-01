let gameHasStarted = false;
var board = null;
var game = new Chess();
var $status = $('#status');
var $moveHistory = $('#moveHistory');
let gameOver = false;


function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false
    if (!gameHasStarted) return false;
    if (gameOver) return false;

    if ((playerColor === 'black' && piece.search(/^w/) !== -1) || (playerColor === 'white' && piece.search(/^b/) !== -1)) {
        return false;
    }

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

// Function to handle piece drop
function onDrop(source, target) {
    let theMove = {
        from: source,
        to: target,
        promotion: 'q' // Always promote to a queen for simplicity
    };

    // Check if the move is legal
    var move = game.move(theMove);

    // Illegal move
    if (move === null) return 'snapback';

    // Emit the move to the server
    socket.emit('move', theMove);
    updateStatus();
}

socket.on('newMove', function (move) {
    game.move(move);
    board.position(game.fen());
    updateStatus();
});

// Update the board position after piece snap
function onSnapEnd() {
    board.position(game.fen());
}

function updateStatus() {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    else if (gameOver) {
        status = 'Opponent disconnected, you win!'
    }

    else if (!gameHasStarted) {
        status = 'Waiting for black to join'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
    $moveHistory.html(game.pgn())
}

// Configuration for the Chessboard
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: '/public/img/chesspieces/{piece}.png'
};
board = Chessboard('myBoard', config);

if (playerColor === 'black') {
    board.flip();
}

updateStatus();

// Join game if a code is provided in the URL
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('code')) {
    socket.emit('joinGame', {
        code: urlParams.get('code')
    });
}

// Start the game when notified by the server
socket.on('startGame', function () {
    gameHasStarted = true;
    updateStatus();
});

// Handle game over due to opponent disconnecting
socket.on('gameOverDisconnect', function () {
    gameOver = true;
    updateStatus();
});

// Handle user list update (e.g., for online users)
socket.on('updateUserList', function (users) {
    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = ''; // Clear the current list

    // Update the list with the new online users
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userListElement.appendChild(li);
    });
});

// Handle leaving the game
$('#leaveGameButton').on('click', function () {
    if (confirm('Are you sure you want to leave the game?')) {
        console.log('Emitting leaveGame event');
        socket.emit('leaveGame');

        // Redirect to the homepage
        socket.on('gameLeft', function () {
            console.log('Received gameLeft acknowledgment');
            window.location.href = '/';
        });
    }
});


