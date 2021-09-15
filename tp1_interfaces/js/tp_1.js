//Barra de herramientas con, al menos, lápiz (que pueda elegir color del lápiz) y goma de borrar, y su funcionalidad.

"use strict";
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let space = canvas.getBoundingClientRect();
let imageRes;
let x = 0; let y = 0; let draw = false; let color = 'black'; let datosImg; let imgWidth = 0; let imgHeight = 0;

canvas.width = 900;
canvas.height = 500;

//Dibuja Canvas Inicial
function drawCanvasBlanco() {

    color = 'white';
    ctx.fillStyle = color;
    ctx.fillRect(0,0,canvas.width,canvas.width);

}
drawCanvasBlanco();

//Color al borde
color = 'black';
ctx.strokeStyle = color;
ctx.lineWidth = 4;
ctx.strokeRect(0, 0, canvas.width, canvas.height);

function getColor(valueColor) {
    color = valueColor;
}
//selecciona el rango del grosor del lapiz o la goma
function getRange(range) {
    ctx.lineWidth = range.value;
    //document.getElementById("value").innerHTML = range.value;
}

//capturo el clic del mouse
canvas.addEventListener('mousedown', function (e) {   
x=e.clientX- space.left;
y=e.clientY- space.top;
draw=true;
});
//capturo el movimiento del mouse
canvas.addEventListener('mousemove', function (e) {

    if (draw === true) {

        drawing(x, y, e.clientX - space.left, e.clientY - space.top);
        x = e.clientX - space.left;
        y = e.clientY - space.top;
    }

})
//detecta si se solto el boton del mouse
canvas.addEventListener('mouseup', function (e) {

    if (draw === true) {

        drawing(x, y,  e.clientX - space.left, e.clientY - space.top);
        x = 0;
        y = 0;
        draw = false;
    }

})
// llama a cambiar color para que actualice el color elegido antes de dibujar
dibujar.addEventListener("click", changeColorOnDrawing);
function changeColorOnDrawing() {
    //document.getElementsByTagName("body")[0].style.cursor = "url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto";

    color = document.getElementById('color').value;
}
//funcion para borrar
function changeColor() {
    color = 'white';
    return color;

}
//dibujar
function drawing(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = range.value;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

}
//borra, el la misma funcion de escribir pero con color blando
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
//limpia el lienzo
function limpiar() {

    canvas.width = 900;
    canvas.height = 500;
    drawCanvasBlanco();
    color = 'black';
    ctx.strokeStyle = color;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

//funcion para descargar la imagen del lienzo
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
//esta funcion quita los filtros aplicados a una imagen
restaurar.addEventListener('click', restaurarImg);
function restaurarImg(){

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

                    canvas.height = imgHeight/(5/2);
                    canvas.width = imgWidth /(5/2);

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
    //Convertir matriz a arreglo  let indice = (X + Y * imageData.width) * 4-El 4 representa los colores 
    //RGBA de cada pixel de la imagen
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

//Filtro Brillo. Lo que hacemos en esta funcion es agregar un poco mas de color en mismas cantidades a todos
// de esta forma cuanto mas agregamos mas nos acercamos al 255 255 255 que seria el blanco.
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

//Función para aplicar el filtro de grises. Acaes a partir de un pixel calculamos el valor promedio de color
//y se lo aplicamos a cada pixel en partes iguales. esto hace que cambie de negro a blanco pasando por los 
//colores intermedios, pero al ser iguales el resultado son distintos tonos de gris
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
// en esta funcion obtenemos el valor negativo simplemente restando el color actual del pixel a 255
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

//Filtro Blanco y Negro. aca lo que hace la funcion es calcular el valor promedio de los colores
//y luego si ese valor es menor a un valor preestablecido se setea el pixel con color negro, y 
//si es mayor con blanco 
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
           //los valores a continuacion fueron los que encontramos luego de investigar el filtro sepia.
           //existen muchos valores pero estos son utilizados comunmente
            imageData.data[index + 0] = (r * .393) + (g * .769) + (b * .189);
            imageData.data[index + 1] = (r * .349) + (g * .686) + (b * .168);
            imageData.data[index + 2] = (r * .272) + (g * .534) + (b * .131);
        }
    }
    //Dibujar imagen en canvas
    ctx.putImageData(imageData, 0, 0);
}

//Filtro BLUR 
//en este filtro lo primero que necesito es el valor promedio de los pixeles que rodean a un 
//pixel en particular de la matriz imagen. asi que recorro la matriz y por cada pixel llamo 
//a la funcion prom, paso como parametros la variable que tiene los datos de la imagen, la posicion
//x e y del pixel a analizar y el color del cual necesito el promedio de sus vecinos.
document.querySelector('#dif').addEventListener('click', difuminado);
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
    //posiciones, obtengo el valor de cada vecicno y de cada color dependiendo del valor de a
    let p00 = getValue(imageData, x - 1, y - 1, a);
    let p01 = getValue(imageData, x, y - 1, a);
    let p02 = getValue(imageData, x + 1, y - 1, a);
    let p10 = getValue(imageData, x - 1, y, a);
    let p11 = getValue(imageData, x, y, a);
    let p12 = getValue(imageData, x + 1, y, a);
    let p20 = getValue(imageData, x - 1, y + 1, a);
    let p21 = getValue(imageData, x, y + 1, a);
    let p22 = getValue(imageData, x + 1, y + 1, a);
//tomo la variable que contiene los datos de la imagen original, la posicion x,y y a es 
//el valor del color que deseo leer, es decir, r,g,b o a
    function getValue(imageData, x, y, a) {
        let index = (x + y * imageData.width) * 4;
        return imageData.data[index + a];
    }
    return (p00 + p01 + p02 + p10 + p11 + p12 + p20 + p21 + p22) / 9;
}

//contraste. este contraste se obtiene al calcular el promedio rgb de cada pixel
// luego por cada color, si el color es mas bajo que el promedio se disminuye el valor del mismo
// si es mayor se aumenta, esto genera mas "separacion de valores", es decir contraste.
//el valor contrast es preestablecido.
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

//Saturacion
//Este filtro es similar al del contraste. Se calcula un valor factor que indica calculo mediante
//la rapidez del cambio. luego se obtiene el valor que indica cuanto cambia el color respecto de si
//mismo. 
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

/*para este filtro usamos las matrices de sobel, matrices de convolucion, 
son una herramienta para poder haer calculos mas complejos de manera mas comoda
una breve explicacion es que El cálculo de la derivada direccional de una función permite 
conocer cómo se producen los cambios en una dirección determinada. Tales cambios suelen 
corresponder a los contornos de los objetos presentes en las imágenes. Se pueden realizar 
estos calculos mediante dichas matrices como una aproximacion a las derivadas. 
Las matrices pueden usarse para realizar distintos efectos sobre una imagen, nosotros usamos
para detectar bordes las de sobel.
*/
bordes.addEventListener('click', detectBordes);
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
    //obtenemos el valor del color de cada pixel y calculamos un promedio para pasar la imagen a
    //escala de grises, esto facilita la deteccion de bordes.
    //luego guardamos esos datos en un array (una copia de la imagen ya gris)
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
    //obtengo el valor de un pixel en particular, en este caso no importa cual rgb ya que 
    //al ser gris son iguales, usamos cero
    function obtenerColorPixel(data, x, y) {
        let index, cpixcel;
        index = (x + y * imageData.width) * 4;
        cpixcel = data[index + 0];
        return cpixcel;
    }
    //hacemos la multiplicacion de la matriz por el valor de cada pixel posicion a posicion
    //tanto para x como y.
    for (y = 1; y < height - 1; y++) {
        for (x = 1; x < width - 1; x++) {
            let pixelX = (
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

            let pixelY = (
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

            let magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY));
            setPixel(imageData, x, y, magnitude, magnitude, magnitude);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
