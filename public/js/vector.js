var Vector2 = function(x, y)
{
	this.x = Math.round(x);
	this.y = Math.round(y);

	this.set = function(x, y)
	{
		this.x = Math.round(x);
		this.y = Math.round(y);
	}
}

var Vector3 = function(x, y, z)
{
	this.x = Math.round(x);
	this.y = Math.round(y);
	this.z = Math.round(z);

	this.set = function(x, y, z)
	{
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.z = Math.round(z);
	}
}

var Vector4 = function(x, y, z, a)
{
	this.x = Math.round(x);
	this.y = Math.round(y);
	this.z = Math.round(z);
	this.a = Math.round(a);

	this.toFillStyle = function()
	{
		return "rgba("+this.x+","+this.y+","+this.z+","+this.a+")";
	}

	this.set = function(x, y, z, a)
	{
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.z = Math.round(z);
		this.a = Math.round(a);
	}
}