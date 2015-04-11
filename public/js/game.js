var Game = function()
{
	var instance = this;

	this.players = {};
	this.configurations = {};
	this.ws = null;

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

		this.ws = io();

		this.ws.emit('setServer', 1);		

	    this.ws.on('addPlayer', function(data) {
			instance.addPlayer(data.token, data);
	    });

	    this.ws.on('disconnectPlayer', function(data) {
	    	delete instance.players[token];
	    });

		this.configure();

		this.update();
	}

	this.configure = function()
	{
		this.getConfiguration("Player");
	}

	this.getConfiguration = function(name)
	{
		if(this.configurations[name] === undefined)
		{
		    var head 	= document.getElementsByTagName('head')[0];
		    var script 	= document.createElement('script');
		    script.type = 'text/javascript';
		    script.src 	= "conf/" + name + ".cfg.js";

		    var callback = function() { instance.setConfiguration(name);}

		    script.onreadystatechange 	= callback;
		    script.onload 				= callback;

		    head.appendChild(script);
		}
		else
		{
			return this.configurations[name];
		}
	}

	this.setConfiguration = function(name)
	{
		var confName = ucfirst(name) + "Conf";

		if(window[confName] !== undefined)
		{

			this.configurations[name] = window[confName];

			window[confName] = undefined;
		}
		else
		{
			console.error("[Game] Configuration for " + name + " doesn't exit in the current context !");
		}
	}

	this.update = function()
	{
		canvas.drawRect(canvas);

		var hasJager = false;

		for(var token in instance.players)
		{
			var player = instance.players[token];

			if(player.isJager === true)
			{
				var other = instance.getCollision(player);

				if(other !== null)
				{
					player.transformToPrey();
					other.transformToJager();
				}

				hasJager = true;
			}
			else if(player.isTransform === true)
			{
				hasJager = true;
			}

			player.update();
		}

		if(hasJager === false && player !== undefined)
		{
			player.transformToJager();
		}

		requestAnimationFrame(instance.update);
	}

	this.getCollision = function(player)
	{
		if(player === undefined)
		{
			console.error("[Game] Try to get collision for an undefined player !");
		}

		for(var token in instance.players)
		{
			var other = instance.players[token];

			if(player === other || other.isTransform === true)
			{
				continue;
			}
			else if(isCollide(player, other) === true)
			{
				return other;
			}
		}

		return null;
	}

	this.addPlayer = function(token, args)
	{
		if(token === undefined)
		{
			console.error("[Game] Try to add player without a valid token !");
		}

		var args = args === undefined ? {} : args;

		if(this.players[token] === undefined)
		{
			this.players[token] = new Player(args);

			this.ws.on('movePlayer', function(data) {
		        instance.movePlayer(data.token, data);
		    });
		}
		else
		{
			console.warn("[Game] Player " + token + " already exists !")
		}

		return this.players[token];
	}

	this.movePlayer = function(token, position)
	{
		if(token === undefined)
		{
			console.error("[Game] Try to move player without a valid token !");
		}

		if(this.players[token] !== undefined)
		{
			this.players[token].move(position);
		}
		else
		{
			console.error("[Game] Try to move an undefined player with token " + token + " !");
		}
	}
}

var game = new Game();

window.onload = function() { game.inititialize(); };