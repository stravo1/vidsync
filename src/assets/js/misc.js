const getTime = (time) => {
  var val = "";
  val +=
    Math.floor(time / 3600).toString().length == 1
      ? "0" + Math.floor(time / 3600).toString()
      : Math.floor(time / 3600).toString();
  val += ":";
  val +=
    (Math.floor(time / 60) % 60).toString().length == 1
      ? "0" + (Math.floor(time / 60) % 60).toString()
      : (Math.floor(time / 60) % 60).toString();
  val += ":";
  val +=
    Math.floor(time % 60).toString().length == 1
      ? "0" + Math.floor(time % 60).toString()
      : Math.floor(time % 60).toString();
  return val;
};

export { getTime };
