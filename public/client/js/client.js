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

var radius = 50;
var radiusMax = 200;

var offsetX, offsetY;
var borneX, borneY;

var token, ws;

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

    // Send player informations
    createPlayer();

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

    ctx.strokeStyle = "black";
    ctx.lineWidth = "1";
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, radiusMax, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    pointers.forEach(function (pointer) {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        ctx.lineWidth = "1";

        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
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

        // Calculate offset
        offsetX = (e.clientX + radius - (canvas.width / 2)) / (radiusMax);
        offsetY = (e.clientY + radius - (canvas.height / 2)) / (radiusMax);

        var dx = Math.abs(e.clientX - canvas.width / 2);
        var dy = Math.abs(e.clientY - canvas.height / 2);
        var R = radiusMax - radius;

        if(dx + dy <= R || dx*dx + dy*dy <= R*R) {
            pointers.item(0).x = e.clientX;
            pointers.item(0).y = e.clientY;
        }

        offsetX = offsetX > 1 ? 1 : offsetX;
        offsetX = offsetX < -1 ? -1 : offsetX;
        offsetY = offsetY > 1 ? 1 : offsetY;
        offsetY = offsetY < -1 ? -1 : offsetY;

        ws.emit('movePlayer', {token: token, x: offsetX, y: offsetY});

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

function createPlayer() {
    ws = io();
    ws.on('setToken', function(data) {
        token = data.token;
    });
    ws.emit('createPlayer', {name : 'Toto'});

    ws.on('nameIsTaken', function() {
        // @todo : say player the name is already taken
        console.log('name already taken, sorry')
    });

    ws.on('serverDisconnected', function() {
        // @todo : say player the server has disconnected
        console.log('server has disconnected :/')
    });
}