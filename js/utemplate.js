var uStache = {}
uStache.compile = function(str) {
  var err = "";
  try {
    var strFunc =
      "with(locals){return ['" +
      str.replace(/[\r\t\n]/g, " ")
        .split("'").join("\\'")
        .split("\t").join("'")
        .replace(/{{(.+?)}}/g, "',$1,'")
      + "'].join('')}";
    var func = new Function("locals", strFunc);
    return func;
  } catch (e) { err = e.message; }
  return "< # ERROR: " + err + " # >";
}

