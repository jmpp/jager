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

	    this.ws.on('addPlayer', function(data) {
	        this.addPlayer(data.token, data);
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

		for(token in instance.players)
		{
			var player 	= instance.players[token];

			if(player.isJager === true)
			{
				var other = this.getCollision(player);

				if(other !== null)
				{
					this.transformPlayer(player);
					this.transformPlayer(other);
				}
			}

			instance.players[token].update();
		}

		requestAnimationFrame(instance.update);
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
		        this.movePlayer(data.token, data);
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

	this.transformPlayer = function(player)
	{
		if(player.isJager === true)
		{
			player.transformToPrey();
		}
		else
		{
			player.transformToJager();
		}
	}
}

var game = new Game();

window.onload = function() { game.inititialize(); };