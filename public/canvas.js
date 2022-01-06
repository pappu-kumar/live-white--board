// const { Socket } = require("dgram");
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencileColor = document.querySelectorAll(".pencil-color");
let pencileWidth = document.querySelector(".pencile-width");
let eraserWidth = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let erColor = "white";
let penWidth = pencileWidth.value;
let erWidth = eraserWidth.value;

let undoRedoTracker = [];   //undo redo data
let track = 0;              //reprsent which action from tracker array

let mouseDown = false;
// API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// how api grapics work for drowing
// tool.beginPath();      //new graphic (path) (line)
// tool.moveTo(10,10);     //start line
// tool.lineTo(100, 150);  //end point
// tool.stroke();      //fill color


// mouse -> start new path, mousemove -> path fill (graphics)
canvas.addEventListener("mousedown" , (e) =>{
    mouseDown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // });    
    let data = {
           x: e.clientX,
           y: e.clientY
    }
    // beginPath(data);
    // send data to server
    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove", (e) => {
    if(mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY
        }
        // drawStroke(data);
        socket.emit("drawStroke", data);
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

undo.addEventListener("click", (e) => {
     if (track > 0) track--;
    // track  action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj)
    // undoRedoCanvas(data);
    socket.emit("redoUndo", data);
})

redo.addEventListener("click", (e) => {
     if(track < undoRedoTracker.length-1) track++;
    //  track action 
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    socket.emit("redoUndo", data);

})

// function to perdorm undo redo function
function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image();  //new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strockObj){
    tool.beginPath();
    tool.moveTo(strockObj.x, strockObj.y);
}

function drawStroke(strockObj){
    tool.lineTo(strockObj.x, strockObj.y);
    tool.stroke();
}

pencileColor.forEach((colorElem) => { 
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        // tool.strokeStyle = penColor;
    // })
    let data ={
        col: colorElem.classList[0]
    }
    socket.emit("pencilColor", data);
    })
})

pencileWidth.addEventListener("change", (e) => {
    penWidth = pencileWidth.value;
    // tool.lineWidth = penWidth;
    let data = {
        penW: penWidth
    }
    socket.emit("pencilWidth", data);

})

eraserWidth.addEventListener("change", (e) => {
    erWidth = eraserWidth.value;
    // tool.lineWidth = erWidth;
    let data= {
        erW: erWidth
    }
    socket.emit("erWidth", data);
})

eraser.addEventListener("click", (e) => {
    if(eraserFlag) {
        // tool.strokeStyle = erColor;
        // tool.lineWidth = eraserWidth;

        let data={
            eCol: erColor,
            eW: eraserWidth
        }
        socket.emit("eColor",data);
    } else{
        // tool.strokeStyle = penColor;
        // tool.lineWidth = penWidth;
        let data={
            pCol: penColor,
            pW: penWidth
        }
        socket.emit("pCW",data);
    }
    
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})


socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
})

socket.on("pencilColor", (data) => {
    tool.strokeStyle = data.col;
})

socket.on("pencilWidth",(data)=>{
    tool.lineWidth = data.penW;
})

socket.on("erWidth", (data)=>{
    tool.lineWidth = data.erW;
})

socket.on("eColor", (data)=>{
    // if(eraserFlag){
        tool.strokeStyle = data.eCol;
        tool.lineWidth = data.eW;
    // }else{
    
    // }
})

socket.on("pCW", (data)=>{
    tool.strokeStyle = data.pCol;
    tool.lineWidth = data.pW
})