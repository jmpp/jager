var Canvas = function()
{
	var instance 	= this;

	this.element 	= null;
	this.context 	= null;

	this.position	= new Vector2(0,0);
	this.scale		= new Vector2(0,0);
	this.color		= new Vector4(0,0,0,1);

	this.inititialize = function()
	{
		if(instance.context === null)
		{
			instance.element 	= document.createElement("canvas");
			instance.element.id = "scene";

			document.body.appendChild(instance.element);

			instance.context = instance.element.getContext("2d");
		}

		return instance.context;
	}

	this.resize = function(width, height)
	{
		var width 	= width === undefined ? 100 : width;
		var height 	= height === undefined ? 100 : height;

		instance.element.width  = window.innerWidth * width / 100;
  		instance.element.height = window.innerHeight * height / 100;

  		instance.scale.set(instance.element.width,instance.element.height);
	}

	this.fillStyle = function(color)
	{
		if(color instanceof Vector4)
		{
			this.context.fillStyle = color.toFillStyle();
		}
	}

	this.drawRect = function(rect)
	{
		var color = rect.color !== undefined ? rect.color : new Vector4(1,1,1,1);

		this.fillStyle(color);

		if(rect.position === undefined)
		{
			console.error("[Canvas] Can't draw rectangle without a valid position !");
		}

		if(rect.scale === undefined)
		{
			console.error("[Canvas] Can't draw rectangle without a valid scale !");
		}

		this.context.fillRect(rect.position.x, rect.position.y, rect.scale.x, rect.scale.y);
	}
}

var canvas = new Canvas();