//Barra de herramientas con, al menos, lápiz (que pueda elegir color del lápiz) y goma de borrar, y su funcionalidad.

"use strict";

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let space = canvas.getBoundingClientRect();
ctx.lineWidth = 1;
let x = 0; let y = 0; let draw = false; let color = 'black'; let datosImg; let imgWidth = 0; let imgHeight = 0;

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
borrar.addEventListener("click", Borrar);

function changeColorOnDrawing() {
    color = document.getElementById('color').value;
    ctx.strokeStyle = color;
    drawing(x1, y1, x2, y2);

}

function changeColor() {
    color = 'white';
    ctx.strokeStyle = color;
    return color;

}

function drawing(x1, y1, x2, y2) {

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = range.value;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

}




function Borrar(x1, y1, x2, y2) {

    ctx.beginPath();
    color = changeColor();
    ctx.strokeStyle = color;
    ctx.lineWidth = range.value;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

}

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

                datosImg = ctx.getImageData(0, 0, canvas.width, canvas.height);



            }
        }



    }

}

///////////FILTROS///////////

//Obtener cantidad de rojo de un pixel
function getRed(imageData, x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + 0];
}

//Obtener cantidad de verde de un pixel
function getGreen(imageData, x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + 1];
}

//Obtener cantidad de azul de un pixel
function getBlue(imageData, x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + 2];
}

//Función para setear el color de cada pixel de una imagen
function setPixel(imageData, x, y, r, g, b, a = 255) {
    //Convertir matriz a arreglo  let indice = (X + Y * imageData.width) * 4-El 4 representa los colores RGBA de cada pixel de la imagen

    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

//Función para aplicar el filtro de grises

grises.addEventListener('click', grey)
function grey() {

    //Obtiene la imagen dibujada en canvas
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {

            let red = getRed(imageData, x, y);
            let green = getGreen(imageData, x, y);
            let blue = getBlue(imageData, x, y);

            let grey = (red + green + blue) / 3;

            setPixel(imageData, x, y, grey, grey, grey);
        }
    }
    //Dibujar imagen en canvas
    ctx.putImageData(imageData, 0, 0);

}

//Filtro Difuminado (Blur).


dif.addEventListener('click', difuminar)
function difuminar() {


    let kernel = [[1, 4, 7, 4, 1], [4, 16, 26, 16, 4], [7, 26, 41, 26, 4], [4, 16, 26, 16, 7], [1, 4, 7, 4, 1]];
    let prom = 0; let p1 = 0; let p2 = 0; let p3 = 0; let p4 = 0; let p5 = 0; let p6 = 0; let p7 = 0; let p8 = 0;
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imageData2 = '';

    for (let x = 0; x < imageData.width; x++) {

        for (let y = 0; y < imageData.height; y++) {
            //p1 = [(x+1),y]
            // prom =([(x+1),y]+[(x-1),y]+[x,(y+1)]+[x,(y-1)]+[(x+1),(y-1)]+[(x-1),(y-1)]+[(x-1),(y-1)]+[(x-1),(y+1)])/9;
            let suma = 0;
            for (let i = 0; i < kernel.length; i++) {

                for (let j = 0; j < kernel.length; j++) {

                    suma = imageData[x - i, y - j] * kernel[i + 1, j + 1];
                    console.log(suma);
                    suma++;
                }

            }

            imageData2 = suma;
            let r = getRed(imageData2, x, y);
            let g = getGreen(imageData2, x, y);
            let b = getBlue(imageData2, x, y);
            let a = 255;


            setPixel(imageData2, x, y, r, g, b);
        }
    }
    //Dibujar imagen en canvas
    ctx.putImageData(imageData2, 0, 0);
}

//Filtro Negativo

negativo.addEventListener('click', invertir);

function invertir() {

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {

            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);

            let rN = 255 - r;
            let gN = 255 - g;
            let bN = 255 - b;


            setPixel(imageData, x, y, rN, gN, bN);
        }
    }
    //Dibujar imagen en canvas
    ctx.putImageData(imageData, 0, 0);

}

//Filtro Blanco y Negro

byn.addEventListener('click', binarizar);

function binarizar() {

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let umbral = 100;
    let byn = 0;

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {

            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);

            let promedio = Math.round((r + g + b) / 3);

            if (promedio < umbral) {
                byn = 0;
            } else {
                byn = 255;
            }

            setPixel(imageData, x, y, byn, byn, byn);
        }
    }

    //Dibujar imagen en canvas
    ctx.putImageData(imageData, 0, 0);

}

//Filtro Sepia

sepia.addEventListener('click', filSepia);

function filSepia() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {

            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);

            let grey = Math.round((r + g + b) / 3);


                    r = grey;
                    g = grey;
                    b = grey;

                    setPixel(imageData, x, y, r, g, b);

        }
    }
    //Dibujar imagen en canvas
    ctx.putImageData(imageData, 0, 0);

}