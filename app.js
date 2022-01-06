const express = require("express"); //access
const socket = require("socket.io");

const app = express();  //intialize and server ready

app.use(express.static("public"));

let port = process.env.PORT || 3000;
let server = app.listen(port, ()=> {
    console.log("listening to port " + port);
})

 let io = socket(server);

io.on('connection',(socket) => {
    console.log('made socket connection');
    // Received data
    socket.on("beginPath", (data) => {
        // data from front end
        //  Transfer data to all connected computers
        io.sockets.emit("beginPath", data);
    })
    socket.on("drawStroke", (data) => {
            io.sockets.emit("drawStroke", data);
    })
    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
    })
    socket.on("pencilColor", (data)=>{
        io.sockets.emit("pencilColor",data);
    })
    socket.on("pencilWidth", (data)=>{
        io.sockets.emit("pencilWidth", data);
    })
    socket.on("erWidth", (data)=>{
        io.sockets.emit("erWidth", data);
    })
    socket.on("eColor", (data)=>{
        io.sockets.emit("eColor", data);
    })
    socket.on("pCW", (data)=>{
        io.sockets.emit("pCW",data);
    })
});