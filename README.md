# Multiplayer Chess Game

## Overview

This is a real-time multiplayer chess game built with Node.js, Express, Socket.IO, and Chessboard.js. Players can challenge each other, join games, and play against each other in real time. The game is designed to be simple and easy to use, with basic functionalities for creating, joining, and managing chess games.

## Features
- Real-time multiplayer functionality using Socket.IO.
- Chess game logic handled by the Chessboard.js library.
- Players can challenge others and join games based on invitation codes.
- Game state updates automatically for all players in a game.
- Users can leave games and view a list of online players.

## Project Structure

- **`index.js`**: Entry point of the application. Sets up environment variables and starts the server.
- **`config.js`**: Contains configuration settings for the server, such as the port number.
- **`server.js`**: Main server file that sets up Express, Handlebars, and Socket.IO.
- **`socketHandlers.js`**: Handles real-time communication using Socket.IO. Manages online users, game challenges, and game state.
- **`routes.js`**: Defines routes for rendering views and handling game setup.
- **`game.html`**: HTML template for the game page, including basic styling and JavaScript logic.
- **`index.html`**: HTML template for the lobby where users can create or join games and view online players.
- **`index.js` (client-side)**: JavaScript file for the client-side logic, including handling user interactions, game state updates, and Socket.IO events.


## Installation

**Clone the repository:**
   git clone <git@github.com:agnesaz/chess_game.git>


##  Install dependencies:
    npm install

##  Create a .env file in the root directory with the following content:
    PORT=3000

##  Run the application:
    node index.js
The server will start on http://localhost:3000.

##  Usage

1.  Open the application in your web browser.

2. Create or Join a Game:
    Enter a game code in the input field and click "Create Game" or "Join Game".
    You will be redirected to the game page where you can play.

3.  Challenge a Player:
    From the lobby, click the "Challenge" button next to an online player’s name.

4.  Respond to Challenges:
    If you receive a challenge, a modal will appear allowing you to accept or reject it.

5.  Play the Game:
    Move pieces on the chessboard by dragging and dropping them.
    The game status and move history will be updated in real time.

6.  Leave a Game:
    Click the "Leave Game" button if you want to exit the current game.


##  Acknowledgments
    Chessboard.js for the chessboard UI.
    Socket.IO for real-time communication.
    Express for the web framework.
