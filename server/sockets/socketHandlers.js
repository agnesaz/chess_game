let onlineUsers = {}; 
let challenges = {};

module.exports = io => {
    io.on('connection', socket => {
        console.log('New socket connection');

        //Assign a guest name to the socket
        const guestName = `Guest_${Math.floor(Math.random() * 1000)}`;
        onlineUsers[socket.id] = guestName; 

        //the updated list of online users to all clients
        io.emit('updateUserList', Object.values(onlineUsers));

        let currentCode = null;

        socket.on('move', function (move) {
            console.log('move detected');
            io.to(currentCode).emit('newMove', move);
        });

        socket.on('joinGame', function (data) {
            currentCode = data.code;
            socket.join(currentCode);
            if (!games[currentCode]) {
                games[currentCode] = true;
                return;
            }

            io.to(currentCode).emit('startGame');
        });

        socket.on('challengeUser', function (data) {
            const { challengedUser, gameCode } = data;
            const challengerName = onlineUsers[socket.id]; 

            console.log(`Challenge from ${challengerName} to ${challengedUser}`);

            // Prevent self-challenge
            if (challengedUser === challengerName) {
                socket.emit('challengeError', { message: 'You cannot challenge yourself.' });
                return;
            }

            // Find the socket ID of the challenged user
            const challengedSocketId = Object.keys(onlineUsers).find(id => onlineUsers[id] === challengedUser);

            if (challengedSocketId) {
                console.log(`Sending challenge to socket ${challengedSocketId}`);

                // Emit the challengeReceived event to the challenged user
                io.to(challengedSocketId).emit('challengeReceived', { challenger: challengerName, gameCode });
                
                console.log(challengedSocketId, "--->challengedSocketId")
                console.log(challengerName, "--->challengerName")

                // Store the challenge in the challenges object
                challenges[challengedSocketId] = { challenger: socket.id, gameCode };
            } else {
                // Emit an error if the user is not found
                socket.emit('challengeError', { message: 'User not found.' });
                console.log('User not found');
            }
        });


        socket.on('acceptChallenge', function (data) {
            const { gameCode } = data;
            const challengerSocketId = challenges[socket.id]?.challenger;

            console.log(`Challenge acceptance by ${onlineUsers[socket.id]}`);

            if (challengerSocketId) {
                const challengerName = onlineUsers[challengerSocketId];
                const opponentName = onlineUsers[socket.id];
                const roomCode = `${challengerName}_vs_${opponentName}`;
                console.log(challengerName, "->challengerName at acceptChallenge ")
                console.log(opponentName, "->opponentName at acceptChallenge")

                io.to(challengerSocketId).emit('challengeAccepted', { roomCode });
                io.to(socket.id).emit('challengeAccepted', { roomCode, challengerName, opponentName });
                io.to(roomCode).emit('startGame');

                delete challenges[socket.id];
                delete challenges[challengerSocketId];

                games[roomCode] = true;

            } else {
                console.log('No challenge to accept');
            }
        });

        socket.on('rejectChallenge', function () {
            const challengerSocketId = challenges[socket.id]?.challenger;

            console.log(`Challenge rejection by ${onlineUsers[socket.id]}`);

            if (challengerSocketId) {
                io.to(challengerSocketId).emit('challengeRejected');
                delete challenges[socket.id];
            } else {
                console.log('No challenge to reject');
            }
        });

        socket.on('leaveGame', function () {
            console.log(`${onlineUsers[socket.id]} has left the game`);

            if (currentCode) {
                // Notify the opponent that the player has left
                io.to(currentCode).emit('opponentLeft', { message: `${onlineUsers[socket.id]} has left the game.` });

                socket.leave(currentCode);

                delete games[currentCode];

                // Notify the leaving player
                socket.emit('gameLeft');
            }
        });
        socket.on('disconnect', function () {
            console.log('socket disconnected');

            // Remove the user from the online list and broadcast the update
            delete onlineUsers[socket.id];
            io.emit('updateUserList', Object.values(onlineUsers));

            // Handle game cleanup
            if (currentCode) {
                io.to(currentCode).emit('gameOverDisconnect');
                delete games[currentCode];
            }

            // Remove any pending challenge involving this user
            delete challenges[socket.id];
        });
    });
};




