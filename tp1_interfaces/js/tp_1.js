//Barra de herramientas con, al menos, lápiz (que pueda elegir color del lápiz) y goma de borrar, y su funcionalidad.

"use strict";

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let space = canvas.getBoundingClientRect();
ctx.lineWidth = 1;
let imageRes;
let x = 0; let y = 0; let x1; let y1; let draw = false; let color = 'black'; let datosImg; let imgWidth = 0; let imgHeight = 0;

canvas.width = 700;
canvas.height = 500;


function getColor(valueColor) {
    color = valueColor;
}

function getRange(range) {
    ctx.lineWidth = range.value;
    document.getElementById("value").innerHTML = range.value;
}


canvas.addEventListener('mousedown', function (e) {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {

            x1 = x;
            y1 = y;
            x = e.layerX - x1;
            y = e.layerY - y1;
           
            }
            if ((x>+0 && x<= imageData.width) && (y>=0 && y<= imageData.height) ){
                draw = true;
            }
        }    

        })

canvas.addEventListener('mousemove', function (e) {

    if (draw === true) {

        drawing(x, y, e.layerX - x1, e.layerY - y1);
        x = e.layerX - x1;
        y = e.layerY - x2;
    }

})

canvas.addEventListener('mouseup', function (e) {

    if (draw === true) {

        drawing(x, y, e.layerX - x1, e.layerY - y1);
        x = 0;
        y = 0;
        draw = false;
    }

})

dibujar.addEventListener("click", changeColorOnDrawing);
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

borrar.addEventListener("click", Borrar);
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

    canvas.width = 700;
    canvas.height = 500;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    color = 'black';
    ctx.strokeStyle = color;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);



}

download.addEventListener("click", guardarImg);
function guardarImg() {

    let filename = prompt("Guardar como...", "Nombre del archivo");
    if (canvas.msToBlob) { //para internet explorer
        let blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, filename + ".png");// la extensión de preferencia pon jpg o png
    } else {
        let link = document.getElementById("download");
        //Otros navegadores: Google chrome, Firefox etc...
        link.href = canvas.toDataURL("image/png");// Extensión .png ("image/png") --- Extension .jpg ("image/jpeg")
        link.download = filename;
    }
}

restaurar.addEventListener('click', restaurarImg);
function restaurarImg() {

    for (let x = 0; x < datosImg.width; x++) {
        for (let y = 0; y < datosImg.height; y++) {

            let r = getRed(datosImg, x, y);
            let g = getGreen(datosImg, x, y);
            let b = getBlue(datosImg, x, y);


            setPixel(datosImg, x, y, r, g, b);
        }
    }
    //Dibujar imagen en canvas
    ctx.putImageData(datosImg, 0, 0);


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

//Filtro Brillo

brillo.addEventListener('click', darBrillo);

function darBrillo() {

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {

            let r = getRed(imageData, x, y) + 25;
            let g = getGreen(imageData, x, y) + 25;
            let b = getBlue(imageData, x, y) + 25;


            setPixel(imageData, x, y, r, g, b);
        }
    }
    //Dibujar imagen en canvas
    ctx.putImageData(imageData, 0, 0);

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
            //modifico funcion setPixel para usarla en esta ya que lo pixeles no se setean de la misma manera.
            let index = (x + y * imageData.width) * 4;

            //guardo valores en  r,g y b.

            let r = imageData.data[index + 0];
            let g = imageData.data[index + 1];
            let b = imageData.data[index + 2];
            //calculo los nuevos valores que van a tener los pixeles. Este cálculo permite obtener el filtro sepia.      
            imageData.data[index + 0] = (r * .393) + (g * .769) + (b * .189);
            imageData.data[index + 1] = (r * .349) + (g * .686) + (b * .168);
            imageData.data[index + 2] = (r * .272) + (g * .534) + (b * .131);
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

document.querySelector('#contraste').addEventListener('click', contraste);

function contraste() {
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

    }
    ctx.putImageData(imageData, 0, 0);
}


document.querySelector('#saturacion').addEventListener('click', saturacion);

function saturacion() {
    
     let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
     let pixels = imageData.data;
     let numPixels = imageData.width * imageData.height;
     let factor;
    let contrast=20;
 
    factor = ( 255 * ( contrast + 255 ) ) / ( 255 * ( 255 - contrast ) );
 
    for ( let i = 0; i < numPixels; i++ ) {
        let r = pixels[ i * 4 ];
        let g = pixels[ i * 4 + 1 ];
        let b = pixels[ i * 4 + 2 ];
 
        pixels[ i * 4 ] = factor * ( r - 128 ) + 128;
        pixels[ i * 4 + 1 ] = factor * ( g - 128 ) + 128;
        pixels[ i * 4 + 2 ] = factor * ( b - 128 ) + 128;
    }
 
    ctx.putImageData(imageData, 0, 0);
};


















//Filtro Deteccion de bordes.

/*bordes.addEventListener('click', detectBordes)
function detectBordes() {

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let r, g, b, a;

        for (let x = 1; x < canvas.width-1; x++) {
            for (let y = 1; y < canvas.height-1; y++) {
                r = calcSobel(imageData, x, y, 0);
                g = calcSobel(imageData, x, y, 1);
                b = calcSobel(imageData, x, y, 2);
                a = calcSobel(imageData, x, y, 3);
                setPixel(imageData, x, y, r, g, b);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    //let sobelX =[-1,0,1,-2,0,2,-1,0,1];
    function calcSobel(imageData, x, y, c) {
        //posiciones
        let p00 = getValue(imageData, x-1, y-1, c);
        let p01 = getValue(imageData, x, y-1, c);
        let p02 = getValue(imageData, x+1, y-1, c);
        let p10 = getValue(imageData, x-1, y, c);
        let p11 = getValue(imageData, x, y, c);
        let p12 = getValue(imageData, x+1, y, c);
        let p20 = getValue(imageData, x-1, y+1, c);
        let p21 = getValue(imageData, x, y+1, c);
        let p22 = getValue(imageData, x+1, y+1, c);

        function getValue(imageData, x, y, c) {
            let index = (x + y * imageData.width) * 4;
            return imageData.data[index + c];
        }

        let sobelx = ((p00 * -1) + (p01 * 0) + (p02 * 1) + (p10 * -2) + (p11 * 0) + (p12 * 2) + (p20 * -1) + (p21 * 0) + (p22 * 1));
        let sobely = ((p00 * 1) + (p01 * 2) + (p02 * 1) + (p10 * 0) + (p11 * 0) + (p12 * 0) + (p20 * -1) + (p21 * -2) + (p22 * -1));

       //let valorFinal = Math.sqrt((sobelx * sobelx)+ (sobely *sobely));

       //return valorFinal
       let valorFinal=sobelx/sobely;
      if(valorFinal>0.1){
           
          return 255;

       } else{

          return 0;    

       }


    }*/

//Filtro Deteccion de bordes.


bordes.addEventListener('click', detectBordes)
function detectBordes() {

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var width = imageData.width;
    var height = imageData.height;

    var kernelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];

    var kernelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];

    let r, g, b, a;
    var grayscaleData = [];
    let avg = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let index = (x + y * width) * 4;
            r = imageData.data[index + 0];
            g = imageData.data[index + 1];
            b = imageData.data[index + 2];
            a = imageData.data[index + 3];
            avg = (r + g + b) / 3;
            grayscaleData.push(avg, avg, avg, a);
        }
    }

    function obtenerColorPixel(data, x, y) {
        let index, cpixcel;
        index = (x + y * imageData.width) * 4;
        cpixcel = data[index + 0];
        return cpixcel;
    }
    for (y = 1; y < height - 1; y++) {
        for (x = 1; x < width - 1; x++) {


            var pixelX = (
                (kernelX[0][0] * obtenerColorPixel(grayscaleData, x - 1, y - 1)) +
                (kernelX[0][1] * obtenerColorPixel(grayscaleData, x, y - 1)) +
                (kernelX[0][2] * obtenerColorPixel(grayscaleData, x + 1, y - 1)) +
                (kernelX[1][0] * obtenerColorPixel(grayscaleData, x - 1, y)) +
                (kernelX[1][1] * obtenerColorPixel(grayscaleData, x, y)) +
                (kernelX[1][2] * obtenerColorPixel(grayscaleData, x + 1, y)) +
                (kernelX[2][0] * obtenerColorPixel(grayscaleData, x - 1, y + 1)) +
                (kernelX[2][1] * obtenerColorPixel(grayscaleData, x, y + 1)) +
                (kernelX[2][2] * obtenerColorPixel(grayscaleData, x + 1, y + 1))
            );

            var pixelY = (
                (kernelY[0][0] * obtenerColorPixel(grayscaleData, x - 1, y - 1)) +
                (kernelY[0][1] * obtenerColorPixel(grayscaleData, x, y - 1)) +
                (kernelY[0][2] * obtenerColorPixel(grayscaleData, x + 1, y - 1)) +
                (kernelY[1][0] * obtenerColorPixel(grayscaleData, x - 1, y)) +
                (kernelY[1][1] * obtenerColorPixel(grayscaleData, x, y)) +
                (kernelY[1][2] * obtenerColorPixel(grayscaleData, x + 1, y)) +
                (kernelY[2][0] * obtenerColorPixel(grayscaleData, x - 1, y + 1)) +
                (kernelY[2][1] * obtenerColorPixel(grayscaleData, x, y + 1)) +
                (kernelY[2][2] * obtenerColorPixel(grayscaleData, x + 1, y + 1))
            );

            var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY));
            setPixel(imageData, x, y, magnitude, magnitude, magnitude);

        }
    }
    ctx.putImageData(imageData, 0, 0);
}
