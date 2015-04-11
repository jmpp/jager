var Vector2 = function(x, y)
{
	this.x = x;
	this.y = y;

	this.set = function(x, y)
	{
		this.x = x;
		this.y = y;
	}
}

var Vector3 = function(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;

	this.set = function(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

var Vector4 = function(x, y, z, a)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.a = a;

	this.toFillStyle = function()
	{
		return "rgba("+this.x+","+this.y+","+this.z+","+this.a+")";
	}

	this.set = function(x, y, z, a)
	{
		this.x = x;
		this.y = y;
		this.z = z;
		this.a = a;
	}
}