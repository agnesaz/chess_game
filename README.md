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

