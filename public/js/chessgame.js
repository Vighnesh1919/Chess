// Initialize the socket connection and Chess instance
const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null; // "w" for white, "b" for black

// Set player role (you might set this based on game setup or server response)
playerRole = "w"; // Example, adjust this as needed

// Function to render the chessboard
const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = ""; // Clear previous board

    boardElement.classList.toggle("flipped", playerRole === "b"); // Flip board based on player role

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark" // Alternate color logic
            );
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };

                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });
};

// Function to handle piece movement
const handleMove = (from, to) => {
    const moveStr = chess.move({
        from: chess.getSquare(from.row, from.col),
        to: chess.getSquare(to.row, to.col),
    });

    if (moveStr) {
        socket.emit("move", moveStr);
        renderBoard();
    }
};

// Function to get Unicode character for the chess piece
const getPieceUnicode = (square) => {
    const pieceMap = {
        p: "♟", // Pawn
        r: "♖", // Rook
        n: "♘", // Knight
        b: "♗", // Bishop
        q: "♕", // Queen
        k: "♔", // King
    };

    return pieceMap[square.type];
};

// Socket event listeners
socket.emit("churan");
socket.on("churan papad", () => {
    console.log("received");
    // Add additional handling code if necessary
});

// Initial rendering of the board
renderBoard();
