function ucfirst(str) {
  str += '';
  var f = str.charAt(0)
    .toUpperCase();
  return f + str.substr(1);
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};