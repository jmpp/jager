var Client = function()
{
    var instance = this;

    this.configurations = {};
    this.ws = null;
    this.token = null;
    this.pointer = null;

    this.offsetX = 0;
    this.offsetY = 0;
    this.pressed = false;

    this.clientX = null;
    this.clientY = null;

    this.inititialize = function()
    {
        canvas.inititialize();
        canvas.resize();

        document.body.onresize = function() { canvas.resize(); }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = (function() {
                return window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function (callback, elements) {
                            window.setTimeout(callback, 1000/40);
                        }
            })();
        }

        // Events
        canvas.element.addEventListener('pointerdown', this.onPointerDown, false);
        canvas.element.addEventListener('pointermove', this.onPointerMove, false);
        canvas.element.addEventListener('pointerup', this.onPointerUp, false);
        canvas.element.addEventListener('pointerout', this.onPointerUp, false);

        // Fix Safari Mode
        canvas.element.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, false);

        this.createPlayer();

        this.configure();

        this.update();
    }

    this.createPlayer = function()
    {
        instance.ws = io();
        instance.ws.on('setToken', function(data) {
            instance.token = data.token;
        });
        var name = UniTest.playerNames[Math.floor(Math.random() * UniTest.playerNames.length)];
        instance.ws.emit('createPlayer', {name : name});

        instance.ws.on('nameIsTaken', function() {
            // @todo : say player the name is already taken
            console.log('name already taken, sorry')
        });

        instance.ws.on('serverDisconnected', function() {
            // @todo : say player the server has disconnected
            console.log('server has disconnected :/')
        });
    }

    this.configure = function()
    {
        instance.getConfiguration("Client");
    }

    this.getConfiguration = function(name)
    {
        if(instance.configurations[name] === undefined)
        {
            var head    = document.getElementsByTagName('head')[0];
            var script  = document.createElement('script');
            script.type = 'text/javascript';
            script.src  = "../conf/" + name + ".cfg.js";

            var callback = function() { instance.setConfiguration(name);}

            script.onreadystatechange   = callback;
            script.onload               = callback;

            head.appendChild(script);
        }
        else
        {
            return instance.configurations[name];
        }
    }

    this.setConfiguration = function(name)
    {
        var confName = ucfirst(name) + "Conf";

        if(window[confName] !== undefined)
        {

            instance.configurations[name] = window[confName];

            window[confName] = undefined;
        }
        else
        {
            console.error("[Game] Configuration for " + name + " doesn't exit in the current context !");
        }
    }

    this.update = function()
    {

        instance.draw();

        if(instance.pointer !== null && instance.pointer !== undefined) {

            var conf = instance.getConfiguration('Client');

            // Calculate offset
            instance.offsetX = (instance.clientX + conf.radius - (canvas.element.width / 2)) / (conf.radiusMax);
            instance.offsetY = (instance.clientY + conf.radius - (canvas.element.height / 2)) / (conf.radiusMax);

            instance.offsetX = instance.offsetX > 1 ? 1 : instance.offsetX;
            instance.offsetX = instance.offsetX < -1 ? -1 : instance.offsetX;
            instance.offsetY = instance.offsetY > 1 ? 1 : instance.offsetY;
            instance.offsetY = instance.offsetY < -1 ? -1 : instance.offsetY;

            instance.ws.emit('movePlayer', {token: instance.token, x: instance.offsetX, y: instance.offsetY});
        }

        requestAnimationFrame(instance.update);
    }

    this.draw = function()
    {
        var conf = instance.getConfiguration('Client');

        if(conf !== undefined) {
            canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);

            canvas.context.strokeStyle = "black";
            canvas.context.lineWidth = "1";
            canvas.context.beginPath();
            canvas.context.arc(canvas.element.width/2, canvas.element.height/2, conf.radiusMax, 0, Math.PI * 2, true);
            canvas.context.stroke();
            canvas.context.closePath();
        }

        if(instance.pointer !== undefined && instance.pointer !== null) {
            canvas.context.strokeStyle = "red";
            canvas.context.fillStyle = "red";
            canvas.context.lineWidth = "1";

            canvas.context.beginPath();
            canvas.context.arc(instance.pointer.x, instance.pointer.y, conf.radius, 0, Math.PI * 2, true);
            canvas.context.fill();
            canvas.context.stroke();
            canvas.context.closePath();
        }
    }

    this.createPointerObject = function(e) {
        var type;
        var color;
        switch(e.pointerType) {
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

    this.onPointerDown = function(e) {
        instance.pointer = instance.createPointerObject(e);
        if(instance.pointer !== null) {
            instance.pressed = true;
        }
    }

    this.onPointerMove = function(e) {
        if(instance.pointer !== undefined && instance.pointer !== null) {

            var conf = instance.getConfiguration('Client');

            instance.clientX = e.clientX;
            instance.clientY = e.clientY;

            var dx = Math.abs(e.clientX - canvas.element.width / 2);
            var dy = Math.abs(e.clientY - canvas.element.height / 2);
            var R = conf.radiusMax - conf.radius;

            if(dx + dy <= R || dx*dx + dy*dy <= R*R) {
                instance.pointer.x = e.clientX;
                instance.pointer.y = e.clientY;
            }

        }
    }

    this.onPointerUp = function(e) {
        if(instance.pointer !== undefined && instance.pointer !== null) {
            instance.pointer.x = canvas.element.width / 2;
            instance.pointer.y = canvas.element.height / 2;
            instance.pressed = false;
            instance.clientX = instance.pointer.x;
            instance.clientY = instance.pointer.y;
        }
    }
}

var client = new Client();

window.onload = function() { client.inititialize(); };
