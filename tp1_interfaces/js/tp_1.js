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
}

function changeColor() {
    color = 'white';
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
    ctx.strokeRect(0, 0, canvas.width, canvas.height);



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
document.querySelector('#dif').addEventListener('click', difuminado);


//Filtro BLUR 
function difuminado() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let r, g, b, a;

    for (let x = 1; x < canvas.width - 1; x++) {
        for (let y = 1; y < canvas.height - 1; y++) {
            r = prom(imageData, x, y, 0);
            g = prom(imageData, x, y, 1);
            b = prom(imageData, x, y, 2);
            a = prom(imageData, x, y, 3);
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function prom(imageData, x, y, a) {
    //posiciones
    let p00 = getValue(imageData, x - 1, y - 1, a);
    let p01 = getValue(imageData, x, y - 1, a);
    let p02 = getValue(imageData, x + 1, y - 1, a);
    let p10 = getValue(imageData, x - 1, y, a);
    let p11 = getValue(imageData, x, y, a);
    let p12 = getValue(imageData, x + 1, y, a);
    let p20 = getValue(imageData, x - 1, y + 1, a);
    let p21 = getValue(imageData, x, y + 1, a);
    let p22 = getValue(imageData, x + 1, y + 1, a);

    function getValue(imageData, x, y, a) {
        let index = (x + y * imageData.width) * 4;
        return imageData.data[index + a];
    }

    return (p00 + p01 + p02 + p10 + p11 + p12 + p20 + p21 + p22) / 9;
}

document.querySelector('#saturacion').addEventListener('click', saturacion);

function saturacion() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let contrast = 10;
        let average = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
        if (average > 127) {
            data[i] += (data[i] / average) * contrast;
            data[i + 1] += (data[i + 1] / average) * contrast;
            data[i + 2] += (data[i + 2] / average) * contrast;
        } else {
            data[i] -= (data[i] / average) * contrast;
            data[i + 1] -= (data[i + 1] / average) * contrast;
            data[i + 2] -= (data[i + 2] / average) * contrast;
        }
        setPixel(imageData, i, 0, data[i], data[i+1], data[i+2], 255);
    }
    ctx.putImageData(imageData, 0, 0);
}