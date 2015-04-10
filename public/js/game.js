var Game = function()
{
	this.inititialize = function()
	{
		canvas.inititialize();
		canvas.resize(90,90);

		document.body.onresize = function() { canvas.resize(90,90); }
	}
}

var game = new Game();

window.onload = function() { game.inititialize(); };