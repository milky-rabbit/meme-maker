const canvas = document.querySelector("canvas");
//context : 붓(브러쉬)
const ctx = canvas.getContext("2d"); //나머지는 3D
canvas.width = 800;
canvas.height = 800;

//ctx.rect(50, 50, 100, 100);
///ctx.moveTo(50, 50);
//ctx.lineTo(150, 50);
//ctx.lineTo(150, 150);
//ctx.lineTo(50, 150);
//ctx.lineTo(50, 50);
//ctx.fill();

// ctx.fillRect(210 -40, 200-20, 15, 100);
// ctx.fillRect(350 -40, 200-20, 15, 100);
// ctx.fillRect(260 -40, 200-20, 60, 200);

// ctx.arc(250, 100, 50, 0, 2*Math.PI);
// ctx.fill();

// ctx.beginPath();
// ctx.fillStyle="white";
// ctx.arc(260+10, 80, 8,Math.PI,  2*Math.PI);
// ctx.arc(220+10, 80, 8,Math.PI,  2*Math.PI);
// ctx.fill(); 

/////////////////////////// MouseMove 이벤트 선 그리기/////////////////////////////
// ctx.lineWidth = 2;

// const colors = [
//     "#1abc9c"
//     ,"#2980b9"
//     ,"#e67e22"
//     ,"#bdc3c7"
//     ,"#2c3e50"
//     ,"#9b59b6"
// ];

// function onClick(event) {
//     console.log(event);

//     ctx.beginPath();
//     ctx.moveTo(400, 400);
//     const color = colors[Math.floor(Math.random() * colors.length)];
//     ctx.strokeStyle = color;
//     ctx.lineTo(event.offsetX, event.offsetY);
//     ctx.stroke();
// }


// canvas.addEventListener("mousemove", onClick);
/////////////////////////// MouseMove 이벤트 선 그리기/////////////////////////////

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraseBtn = document.getElementById("erase-btn");
const drawnfillBtn = document.getElementById("drawnfill-btn");
const squareBtn = document.getElementById("square-btn");
const circleBtn = document.getElementById("circle-btn");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");
const saveBtn = document.getElementById("save");
const fontStyle = document.getElementById("font-style");
const fontSize = document.getElementById("font-size");
const fontName = document.getElementById("font-name");
const fontType = Array.from(document.getElementsByName("font-type"));


ctx.lineWidth = lineWidth.value;
ctx.lineCap ="round";
let isPainting = false;
let isFilling = false;
let isDrawFilling = false;
let isSquare = false;
let isCircle = false;

let fontStyleValue = fontStyle.value;
let fontSizeValue = fontSize.value + "px";
let fontNameValue = fontName.value;
let fontTypeValue = "stroke"; 

let startX = null;
let startY = null;
let finishX = null;
let finishY = null;
let radius = null;

function onMove(event) {
    if(isPainting) {
        if(isSquare) {
            if(startX != null && startY != null) {
                finishX = event.offsetX-startX;
                finishY = event.offsetY-startY;
                //ctx.fillRect(startX, startY, finishX,finishY);
                //ctx.strokeRect(startX, startY, finishX,finishY);
            }
        } else if(isCircle) {
            if(startX != null && startY != null) {
                
            radius =  event.offsetX-startX;
            radius = (radius < 0) ? (radius*-1) : radius;
            console.log(isCircle);
            console.log(radius);

            //Math.sqrt(4)
            ctx.arc(startX, startY, radius, 0, 2*Math.PI );
                ctx.fill();
            }
        } else {
            ctx.lineTo(event.offsetX, event.offsetY);
            if(isDrawFilling) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
        return;
    }

    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting(event) {
    isPainting = true;

    startX = event.offsetX;
    startY = event.offsetY;
}


function cancelPainting(event) {
    isPainting = false;
    if(isSquare) {
        if(startX != null && startY != null) {
            ctx.fillRect(startX, startY, finishX,finishY);
            //ctx.strokeRect(startX, startY, finishX,finishY);
            startX = null;
            startY = null;
        }
    } else if(isCircle) {
        if(startX != null && startY != null) {
            ctx.arc(startX, startY, radius, 0, 2*Math.PI );
            startX = null;
            startY = null;
        }
    }

    ctx.beginPath();
}

function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
    changeColor(event.target.value);
}

function onColorClick(event) {
    //console.dir(event.target.dataset.color);
    const colorValue = event.target.dataset.color;
    changeColor(colorValue);
    color.value = colorValue;
    console.dir(ctx);
    //changeColor(event.target.dataset.color);
}

function changeColor(colorValue) {
    ctx.strokeStyle = colorValue;
    ctx.fillStyle =  colorValue;
}

function onModeClick(event) {
    if(isFilling) {
        isFilling = false;
        modeBtn.innerText = "💗 Fill";
    } else {
        isFilling = true;
        modeBtn.innerText = "🤍 Draw";
    }
    isDrawFilling = false;
}

function onCanvasClick(event) {
    if(isFilling) {
        ctx.fillRect(0, 0,CANVAS_WIDTH, CANVAS_HEIGHT);
        isSquare = false;
        isCircle = false;
    }
}

function onDestroyClick(event){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0,CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = color.value;

    isDrawFilling = false;
    isSquare = false;
    isCircle = false;
}

function onEraserClick(event) {
    ctx.strokeStyle = "white";
    isFilling = false;
    isDrawFilling = false;
    isSquare = false;
    isCircle = false;
    modeBtn.innerText = "Fill";
    ctx.fillStyle = color.value;
}

function onFileChange(event) {

    const file = event.target.files[0];
    const url = URL.createObjectURL(file);

    const image = new Image();
    image.src = url;
    image.onload = function() {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    };
}
// canvas.onmousemove = function() {

// 
function onDoubleClick(event) {
    //console.log(event.offsetX, event.offsetY);
    isDrawFilling = false;
    if(text !== "") {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font =  `${fontStyleValue} ${fontSizeValue} ${fontNameValue}`;
        console.log(ctx.font);
        const text = textInput.value;
        if(fontTypeValue === "stroke") {
            ctx.strokeText(text,  event.offsetX, event.offsetY);
        } else {
            ctx.fillText(text,  event.offsetX, event.offsetY);
        }
        ctx.restore();
    }
  
}

function onSaveClick(event) {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}

function onFontStyleChange(event) {
    if(event.target.id === "font-size") {
        fontSizeValue = event.target.value + "px";
    } else if(event.target.id === "font-style") {
        fontStyleValue = event.target.value;
    } else if(event.target.id === "font-name") {

        let urlValue = "";
        if(event.target.value === "La-Belle-Aurore") {
            urlValue = "https://fonts.gstatic.com/s/labelleaurore/v16/RrQIbot8-mNYKnGNDkWlocovHeI4HO2E.woff2";
        } else if(event.target.value === "lnk-Free") {
            urlValue = "fonts/INKFREE.TTF";
        } else if(event.target.value === "Impact") {
            urlValue = "fonts/IMPACT.TTF";
        }
        console.log(`${urlValue}`);
        if(urlValue !== "") {
            let font = new FontFace(
                event.target.value,
                //"url(https://fonts.gstatic.com/s/oxygen/v5/qBSyz106i5ud7wkBU-FrPevvDin1pK8aKteLpeZ5c0A.woff2)"
                "url(" + urlValue + ")"
            );
              
            font.load().then(function() {
                console.log(font.family);
                fontNameValue = font.family;
                document.fonts.add(font);
              
                //const fontset = Array.from(document.fonts);
                //fontset.forEach(ff => console.log(ff));
            });
        } else {
            fontNameValue = event.target.value;
        }
        
    } else {
        fontTypeValue = event.target.value;
    }
}

function onDragSquare(event) {
    onModeClick(event);
    isSquare = true;
    isFilling = false;
    isCircle = false;
}

function onDragCircle(event) {
    onModeClick(event);
    isSquare = false;
    isFilling = false;
    isCircle = true;
}

function onDrawnFile(event) {
    isSquare = false;
    isCircle = false;

    if(isDrawFilling) {
        isDrawFilling = false;
        drawnfillBtn.innerText = "➰ Draw&Fill OFF";
    } else {
        isDrawFilling = true;
        drawnfillBtn.innerText = "➰ Draw&Fill ON";
    }
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
colorOptions.forEach(color => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
canvas.addEventListener("click", onCanvasClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
canvas.addEventListener("dblclick", onDoubleClick);
saveBtn.addEventListener("click", onSaveClick);
fontSize.addEventListener("change", onFontStyleChange);
fontStyle.addEventListener("change", onFontStyleChange);
fontType.forEach(ft => ft.addEventListener("change", onFontStyleChange));
fontName.addEventListener("change", onFontStyleChange);
/*
let font = new FontFace(
  "FontFamily Oxygen",
  //"url(https://fonts.gstatic.com/s/oxygen/v5/qBSyz106i5ud7wkBU-FrPevvDin1pK8aKteLpeZ5c0A.woff2)"
  //"url(C:/Windows/Fonts/sylfaen.ttf)"
  "url(fonts/INKFREE.TTF)"
);

font.load().then(function() {
    console.log(font.family);
    fontName = font.family;
    document.fonts.add(font);

    const fontset = Array.from(document.fonts);
    fontset.forEach(ff => console.log(ff));
});
*/

squareBtn.addEventListener("click", onDragSquare);
circleBtn.addEventListener("click", onDragCircle);
drawnfillBtn.addEventListener("click", onDrawnFile);