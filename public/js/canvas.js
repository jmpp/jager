var Canvas = function()
{
	var instance 	= this;

	this.element 	= null;
	this.context 	= null;

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
		width 	= width === undefined ? 100 : width;
		height 	= height === undefined ? 100 : height;

		instance.element.width  = window.innerWidth * width / 100;
  		instance.element.height = window.innerHeight * height / 100;
	}
}

var canvas = new Canvas();