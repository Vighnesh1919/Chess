const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express(); // instance of express used to be in http
const server = http.createServer(app); // http and express server connect

// instantiate socket
const io = socket(server); // socket helps to connect by real time

const chess = new Chess(); // new game
// all rules of chess are now in upper const

let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index",{title:"Chess Game"});
});

io.on("connection", function(uniquesocket){
    console.log("connected");// when other try to connect your website via link 
   uniquesocket.on("churan",function(){
//  console.log("churan received");
io.emit("churan papad");// backend will send it to all 
   })
   uniquesocket.on("disconnect", function(){
    console.log("disconnected");
   });
})

server.listen(3000, function () {
    console.log("server is running");
});
