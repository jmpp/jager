var Player = function(args)
{
	var args = args === undefined ? {} : args;
	var conf = game.getConfiguration("Player");

	this.name		= args.name !== undefined ? args.name : null;
	this.color		= args.color !== undefined ? args.color : new Vector4(255,255,255,1);

	this.position 	= new Vector2(canvas.position.x + (canvas.scale.x * .9) * Math.random(), canvas.position.y + (canvas.scale.y * .9) * Math.random());
	this.scale 		= new Vector2(conf.scaleMin.x, conf.scaleMin.y);
	this.speed		= new Vector2(conf.speedMin.x, conf.speedMin.y);

	this.isJager		= false;
	this.isTransform	= false;
	this.canMove		= true;

	this.transformTime		= 0;
	this.transformDuration 	= conf.transformDuration;

	this.update = function()
	{
		this.render();

		if(this.isTransform === true)
		{
			this.isTransform = this.transform();
		}
	}

	this.render = function()
	{
		canvas.drawRect(this);
	}

	this.move = function(direction)
	{
		if(this.canMove === true)
		{
			this.position.x += this.speed.x * direction.x;
			this.position.y += this.speed.y * direction.y;
		}
	}

	this.moveTo = function(target)
	{
		var angle = Math.atan2(target.y - this.position.y, target.x - this.position.x);

		var direction = {x: Math.cos(angle), y: Math.sin(angle)};

		this.move(direction);
	}

	this.transform = function()
	{
		var time 	 = new Date().getTime() - this.transformTime;
		var duration = this.isJager === false ? this.transformDuration * 4 : this.transformDuration;

		if(time > duration)
		{
			this.isJager = !this.isJager;
			this.canMove = true;

			return false;
		}

		var conf 		= game.getConfiguration("Player");
		var ratio		= time / duration;
		var scale 		= {x: conf.scaleMin.x + (conf.scaleMax.x - conf.scaleMin.x), y: conf.scaleMin.y + (conf.scaleMax.y - conf.scaleMin.y)};
			scale 		= this.isJager === true 
			? {x: scale.x * (1 - ratio), y: scale.y * (1 - ratio)}
			: {x: scale.x * ratio, y: scale.y * ratio};

		this.setScale(scale);

		return true;
	}

	this.transformToPrey = function()
	{
		if(this.isJager === true && this.isTransform === false)
		{
			this.isTransform 	= true;

			this.transformTime 	= new Date().getTime();
		}
	}

	this.transformToJager = function()
	{
		if(this.isJager === false && this.isTransform === false)
		{
			this.canMove 		= false;
			this.isTransform 	= true;

			this.transformTime 	= new Date().getTime();
		}
	}

	this.setScale = function(scale)
	{
		this.position.set(this.position.x + this.scale.x/2, this.position.y + this.scale.y/2);
		
		this.scale.set(scale.x.clamp(conf.scaleMin.x, conf.scaleMax.x), scale.y.clamp(conf.scaleMin.y, conf.scaleMax.y));

		this.position.set(this.position.x - this.scale.x/2, this.position.y - this.scale.y/2);
	}
}