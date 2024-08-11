const socket =io();

socket.emit("churan");
socket.on("churan papad",function(){
    console.log("received");
});
