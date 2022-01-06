let toolsCont = document.querySelector(".tools-cont");
let optionCont = document.querySelector(".option-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let upload = document.querySelector(".upload");
// let sticky = document.querySelector(".sticky");

let pencilFlag = false;
let eraserFlag = false;
let optionFlag = true;
let img = false;

// ture -> tools show,,   false-> hide tools
optionCont.addEventListener("click", (e) => {
    optionFlag = !optionFlag;

    if(optionFlag) openTools();
    else closeTools();
})

function openTools(){
    let iconElem = optionCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");      // <i class="fas fa-times"></i>
    toolsCont.style.display = "flex";
}

function closeTools(){
    let iconElem = optionCont.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

// pencile hide and show
pencil.addEventListener("click", (e) => {
    // true-> show pencil color, flase-> hide pencil color
    pencilFlag = !pencilFlag;

    if(pencilFlag){
        pencilToolCont.style.display = "block";
        eraserToolCont.style.display = "none";
        eraserFlag = !eraserFlag;
    } 
    else pencilToolCont.style.display = "none";
})

// eraser hode and show
eraser.addEventListener("click", (e) => {
    // true-> show eraser tools, flase-> hide eraser tools
    eraserFlag = !eraserFlag;

    if(eraserFlag) {
        eraserToolCont.style.display = "flex";
        pencilToolCont.style.display = "none";
        pencilFlag = !pencilFlag;
    }
    else eraserToolCont.style.display = "none";
})

// code for open image from file
upload.addEventListener("click", (e) => {
    // OPEN file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
    

        let stickCont = document.createElement("div");
        stickCont.setAttribute("class", "sticky-cont");
        stickCont.innerHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
        `;
        document.body.appendChild(stickCont);

        let minimize = stickCont.querySelector(".minimize");
        let remove = stickCont.querySelector(".remove");
        noteActions(minimize, remove, stickCont);
        
        stickCont.onmousedown = function(event) {
            dragAndDrop(stickCont, event)
          };
          
        stickCont.ondragstart = function() {
            return false;
        }; 
    });
})


function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
  
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
  
    moveAt(event.pageX, event.pageY);
  
    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // drop the ball, remove unneeded handlers
    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
}


// to minimize image
function noteActions(minimize, remove, stickCont) {
    remove.addEventListener("click", (e) => {
        stickCont.remove();
    })

    minimize.addEventListener("click", (e) => {
        let noteCont = stickCont.querySelector(".note-cont");
        if(img){ 
            noteCont.style.display = "block";
            img = false;
        }
        else{
            noteCont.style.display = "none";
            img = true;
        }
    })
}

