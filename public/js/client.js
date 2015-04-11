"use strict";

// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var pointers; // collections of pointers

var canvas, ctx; // ctx is the canvas' context 2D

var radius = 100;

document.addEventListener("DOMContentLoaded", init);

window.onorientationchange = resetCanvas;
window.onresize = resetCanvas;

function fixSafariMode() {
    canvas.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);
}

function init() {
    setupCanvas();
    pointers = new Collection();
    fixSafariMode();
    canvas.addEventListener('pointerdown', onPointerDown, false);
    canvas.addEventListener('pointermove', onPointerMove, false);
    canvas.addEventListener('pointerup', onPointerUp, false);
    canvas.addEventListener('pointerout', onPointerUp, false);
    requestAnimFrame(draw);
}

function resetCanvas(e) {
    // resize the canvas - but remember - this clears the canvas too.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //make sure we scroll to the top left.
    window.scrollTo(0, 0);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pointers.forEach(function (pointer) {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        ctx.lineWidth = "1";

        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    });

    requestAnimFrame(draw);
}

function createPointerObject(e) {
    var type;
    var color;
    switch (e.pointerType) {
        case e.POINTER_TYPE_MOUSE:
            type = "MOUSE";
            color = "red";
            break;
        case e.POINTER_TYPE_PEN:
            type = "PEN";
            color = "lime";
            break;
        case e.POINTER_TYPE_TOUCH:
            type = "TOUCH";
            color = "cyan";
            break;
    }
    return { identifier: 0, x: e.clientX, y: e.clientY, type: type, color: color };
}

function onPointerDown(e) {
    pointers.add(0, createPointerObject(e));
}

function onPointerMove(e) {
    if (pointers.item(0)) {
        pointers.item(0).x = e.clientX;
        pointers.item(0).y = e.clientY;
    }
}

function onPointerUp(e) {
    if (pointers.item(0)) {
        pointers.item(0).x = canvas.width / 2;
        pointers.item(0).y = canvas.height / 2;
    }
}

function setupCanvas() {

    // Get the canvas & context
    canvas = document.getElementById('responsive-canvas');
    ctx = canvas.getContext("2d");

    // Properties
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.lineStyle = "rgb(255, 100, 100)";

    // Run function when browser resizes
    window.onresize = respondCanvas;
    function respondCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Initial call 
    respondCanvas();

}