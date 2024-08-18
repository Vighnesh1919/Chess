const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let players = {}; // Stores player ids
let currentPlayer = "W"; // Track the current player

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" });
});

io.on("connection", (socket) => {
    console.log("A player connected");

    // Assign player roles
    if (!players.white) {
        players.white = socket.id;
        socket.emit("playerRole", "W");
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playerRole", "B");
    } else {
        socket.emit("spectatorRole");
    }

    // Handle player disconnection
    socket.on("disconnect", () => {
        if (socket.id === players.white) {
            delete players.white;
        } else if (socket.id === players.black) {
            delete players.black;
        }
    });

    // Handle chess moves
    socket.on("move", (move) => {
        try {
            if ((chess.turn() === 'w' && socket.id !== players.white) ||
                (chess.turn() === 'b' && socket.id !== players.black)) {
                return; // Ignore moves if it's not the player's turn
            }

            const result = chess.move(move); // Process the move

            if (result) {
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else {
                console.log("Invalid move:", move);
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            console.error(err);
            socket.emit("error", "An error occurred: " + err.message);
        }
    });

    // Additional code for handling game logic, moves, etc.
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
