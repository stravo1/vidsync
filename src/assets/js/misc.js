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

 // Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyCt8Eit11OTXtqOA1fgIDS98_WfjWMT2t0",
  authDomain: "synkvid.firebaseapp.com",
  projectId: "synkvid",
  storageBucket: "synkvid.appspot.com",
  messagingSenderId: "855901352282",
  appId: "1:855901352282:web:6fdc5569fa7854f8784363",
};
export { getTime, firebaseConfig };
