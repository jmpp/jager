function ucfirst(str) 
{
  str += '';

  var f = str.charAt(0).toUpperCase();

  return f + str.substr(1);
}

Number.prototype.clamp = function(min, max) 
{
  return Math.min(Math.max(this, min), max);
};

function isCollide(a, b)
{

  if(a.position === undefined || a.scale === undefined)
  {
    console.error("[libutil] Is collide first object doesn't have a valid position or scale !");
  }

  if(b.position === undefined || b.scale === undefined)
  {
    console.error("[libutil] Is collide second object doesn't have a valid position or scale !");
  }

  return a.position.x + a.scale.x >= b.position.x 
        && a.position.y + a.scale.y >= b.position.y
        && a.position.x <= b.position.x + b.scale.x
        && a.position.y <= b.position.y + b.scale.y;
}