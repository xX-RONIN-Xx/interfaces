//Barra de herramientas con, al menos, lápiz (que pueda elegir color del lápiz) y goma de borrar, y su funcionalidad.

"use strict";

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let space = canvas.getBoundingClientRect();
ctx.lineWidth = 1;
let x = 0; let y = 0; let draw = false; let erase = false; let color = 'black'; let datos; let imgWidth = 0; let imgHeight = 0;

canvas.width = 900;
canvas.height = 500;


function getColor(valueColor) {
    color = valueColor;
}

function getRange(range) {
    ctx.lineWidth = range.value;
    document.getElementById("value").innerHTML = range.value;
}

canvas.addEventListener('mousedown', function (e) {

    x = e.clientX - space.left;
    y = e.clientY - space.top;
    draw = true;
    

})

canvas.addEventListener('mousemove', function (e) {

    if (draw === true) {

        drawing(x, y, e.clientX - space.left, e.clientY - space.top);
        x = e.clientX - space.left;
        y = e.clientY - space.top;
    }

})

canvas.addEventListener('mouseup', function (e) {

    if (draw === true) {

        drawing(x, y, e.clientX - space.left, e.clientY - space.top);
        x = 0;
        y = 0;
        draw = false;
    }

})

dibujar.addEventListener("click", changeColorOnDrawing);
borrar.addEventListener("click", changeColor);

function changeColorOnDrawing(){
    color = document.getElementById('color').value;
    ctx.strokeStyle = color;
   // drawing(x, y, 0,0);

}
function changeColor(){
    color = 'white';
    ctx.strokeStyle = 'white';
    drawing(x, y, 0,0);

}

function drawing(x1, y1, x2, y2) {
    ctx.beginPath();
   // ctx.strokeStyle = color;
    changeColorOnDrawing();
    ctx.lineWidth = range.value;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    
}
    



/*function Borrar(x1, y1, x2, y2) {
    //erase = true;
    color = 'white';
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = range.value;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

}*/

function limpiar() {

    canvas.width = 900;
    canvas.height = 500;
    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    color = 'black';
    ctx.strokeStyle = color;
    ctx.strokeRec(0, 0, canvas.width, canvas.height);



}



//Cargar imagen y adaptar el lienzo a la misma.

const fileSelect = document.getElementById("fileSelect"),
fileElem = document.getElementById("fileElem"),
fileList = document.getElementById("fileList");

fileSelect.addEventListener("click", function (e) {
    if (fileElem) {
        fileElem.click();
    }
    e.preventDefault(); // prevent navigation to "#"
}, false);

fileElem.addEventListener("change", cargarImagen, false);

function cargarImagen() {
    
    if (!this.files.length) {
        fileList.innerHTML = "<p>No files selected!</p>";
        
    } else {
        fileList.innerHTML = "";
        
        for (let i = 0; i < this.files.length; i++) {

            const img = document.createElement("img");
            img.src = URL.createObjectURL(this.files[i]);
            img.onload = function () {
                URL.revokeObjectURL(this.src);

                imgWidth = img.width;
                imgHeight = img.height;

                //adapato el lienzo al tamaño de la imagen.

                if ((imgHeight > canvas.height && imgWidth > canvas.width) || (imgHeight > canvas.height && imgWidth < canvas.width) ||
                    (imgHeight < canvas.height && imgWidth > canvas.width)) {

                    canvas.height = imgHeight / 2;
                    canvas.width = imgWidth / 2;

                } else {

                    canvas.width = imgWidth;
                    canvas.height = imgHeight;

                }

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                let dataImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
                datos = dataImage.data;
            }
        }



    }

}
