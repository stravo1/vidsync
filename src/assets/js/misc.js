import { dataChannel, messages, name, paused, subsName, time } from "./store";
import { get } from "svelte/store";

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

const commandInterpreter = (command) => {
  var seek = /:seek \d+.\d*/;
  var setVid = /:set-video \w+/;
  var setSub = /:set-sub \w+/;
  var text = "";
  switch (command) {
    case ":play":
      paused.set(false);
      text = "playing video";
      break;
    case ":pause":
      paused.set(true);
      text = "pausing video";
      break;

    default:
      if (seek.test(command)) {
        var timeStamp = parseFloat(seek.exec(command)[0].split(" ")[1]);
        time.set(timeStamp);
        setTimeout(() => {
          time.set(timeStamp);
        }, 100);
        setTimeout(() => {
          time.set(timeStamp);
        }, 150);
        setTimeout(() => {
          time.set(timeStamp);
        }, 200);
        setTimeout(() => {
          time.set(timeStamp);
        }, 250);
        text = `seeking to ${getTime(timeStamp)}`;
        break;
      } else if (setVid.test(command)) {
        var arr = command.split(" ");
        arr.splice(0, 1);
        var file = arr.join(" ");
        var $nameVal = get(name);
        var $datachannelVal = get(dataChannel);

        text = "Peer selectd a video file.\n";
        if ($nameVal == "") {
          text += "Select a file.";
        } else if ($nameVal == file) {
          text += "It's a match!";
          $datachannelVal.send("Videos matched :)");
        } else {
          text += "File names didn't match.";
        }
        break;
      } else if (setSub.test(command)) {
        var arr = command.split(" ");
        arr.splice(0, 1);
        var file = arr.join(" ");
        var $nameVal = get(subsName);
        var $datachannelVal = get(dataChannel);

        text = "Peer selectd a subtitle file.\n";
        if ($nameVal == "") {
          text += "Select a file.";
        } else if ($nameVal == file) {
          text += "It's a match!";
          $datachannelVal.send("Subtitles matched :)");
        } else {
          text += "File names didn't match.";
        }
        break;
      }

      text = "oops! try again \n use :help to get list of all commands";
  }
  messages.update((arr) => [
    ...arr,
    {
      name: "@system",
      message: text,
      received: false,
      help: true,
    },
  ]);
};
export { getTime, firebaseConfig, commandInterpreter };
