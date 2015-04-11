var Player = function(args)
{
	var args = args === undefined ? {} : args;

	this.name		= args.name !== undefined ? args.name : null;
	this.color		= args.color !== undefined ? args.color : new Vector4(255,255,255,1);

	this.position 	= new Vector2(canvas.position.x + canvas.scale.x / 2, canvas.position.y + canvas.scale.y/2);
	this.scale 		= new Vector2(5,5);
	this.speed		= new Vector2(1,1);

	this.move = function(position)
	{
		this.position.x += this.speed.x * position.x;
		this.position.y += this.speed.y * position.y;
	}
}