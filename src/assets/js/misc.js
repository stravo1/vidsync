import {
  connected,
  dataChannel,
  messages,
  micPermissions,
  name,
  paused,
  peerName,
  subsName,
  time,
  user,
} from "./store";
import { get } from "svelte/store";
import { collection, deleteDoc, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt8Eit11OTXtqOA1fgIDS98_WfjWMT2t0",
  authDomain: "synkvid.firebaseapp.com",
  projectId: "synkvid",
  storageBucket: "synkvid.appspot.com",
  messagingSenderId: "855901352282",
  appId: "1:855901352282:web:6fdc5569fa7854f8784363",
};

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

const commandInterpreter = (command) => {
  /* all reg-ex */
  var nameSet = /:name .+/;
  var seek = /:seek \d+/;
  var setVid = /:set-video .+/;
  var setSub = /:set-sub .+/;

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
    case ":mic false":
      micPermissions.set(false);
      text = "peer did not provide mic permission. calls are disabled :(";
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
      } else if (nameSet.test(command)) {
        var arr = command.split(" ");
        arr.splice(0, 1);
        var peer = arr.join(" ");
        peerName.set(peer);
        text = `${peer} joined! say hello :)`;
        break;
      }

      text = "oops! try again";
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

const registerPeerConnectionListeners = (peerConnection, audio) => {
  peerConnection.addEventListener("icegatheringstatechange", () => {
    console.log(
      `ICE gathering state changed: ${peerConnection.iceGatheringState}`
    );
  });

  peerConnection.addEventListener("connectionstatechange", () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener("signalingstatechange", () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener("iceconnectionstatechange ", () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`
    );
  });
  peerConnection.addEventListener("track", async (event) => {
    let $micPermissions = get(micPermissions);
    if (!$micPermissions) return;
    console.log("Track added: ", event.streams);
    const remoteStream = event.streams;
    audio.srcObject = remoteStream[0];
    audio.play();
  });
  // for use in chatbox to relay audio
};

const registerChannelEventListeners = (channel, hangUp) => {
  let $dataChannel = get(dataChannel);
  let $micPermissions = get(micPermissions);
  let $user = get(user);
  channel.addEventListener("open", (event) => {
    console.log("Channel opened");
    connected.set(true);
    $dataChannel.send(`:name ${$user.displayName}`); // exchange each other's names
    if (!$micPermissions) $dataChannel.send(":mic false");
  });

  // Disable input when closed
  channel.addEventListener("close", (event) => {
    console.log("Channel closed");
    messages.update((arr) => [
      ...arr,
      {
        name: "@system",
        message: "peer disconnected. hanging up...", // guest
        received: true,
        help: true,
      },
    ]);
    setTimeout(hangUp, 1000);
  });
  channel.addEventListener("message", (event) => {
    let $peerName = get(peerName);
    var seek = /:seek \d+.\d*/;
    console.log("Message received: " + event.data);
    if ($peerName != null) {
      // add to message box only after name exchange is complete
      messages.update((arr) => [
        ...arr,
        {
          name: $peerName,
          message: seek.test(event.data)
            ? event.data.split(" ")[0] +
              " " +
              getTime(parseFloat(event.data.split(" ")[1]))
            : event.data,
          received: true,
          help: false,
        },
      ]);
    }
    var cmd = /^:.+/;
    if (cmd.test(event.data)) {
      commandInterpreter(event.data);
    }
  });
};
const deleteICEFromStore = async (db, roomId) => {
  const calleeCandidates = await getDocs(
    collection(db, "rooms", roomId, "callee")
  );
  calleeCandidates.docs.forEach(async (candidate) => {
    // delete all the callee's ICE candidate list
    await deleteDoc(candidate.ref);
  });
  const callerCandidates = await getDocs(
    collection(db, "rooms", roomId, "caller")
  );
  callerCandidates.docs.forEach(async (candidate) => {
    // delete all the caller's ICE candidate list
    await deleteDoc(candidate.ref);
  });
};
export {
  getTime,
  firebaseConfig,
  commandInterpreter,
  registerPeerConnectionListeners,
  registerChannelEventListeners,
  deleteICEFromStore,
};
