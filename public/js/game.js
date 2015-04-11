var Game = function()
{
	var instance = this;

	this.players = {};

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

		this.update();
	}

	this.update = function()
	{

		canvas.drawRect(canvas);

		for(token in instance.players)
		{
			var player = instance.players[token];

			canvas.drawRect(player);
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