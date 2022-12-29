<script>
  import Dashboard from "./lib/Dashboard.svelte";
  import Screen from "./lib/Screen.svelte";
  import TopPanel from "./lib/TopPanel.svelte";
  import { initializeApp } from "firebase/app";
  import {
    getFirestore,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    onSnapshot,
    doc,
    collection,
  } from "firebase/firestore";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import {
    commandInterpreter,
    firebaseConfig,
    getTime,
    registerPeerConnectionListeners,
  } from "./assets/js/misc";
  import {
    authObj,
    caller,
    connected,
    creating,
    dataChannel,
    files,
    joining,
    loaded,
    loggedIn,
    messages,
    peerName,
    user,
    waiting,
  } from "./assets/js/store";
  import Auth from "./lib/Auth.svelte";
  import LoadingModal from "./lib/components/LoadingModal.svelte";

  const configuration = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  let peerConnection = new RTCPeerConnection(configuration);
  let hanging = false;
  let roomId = null;
  let localName;
  let remoteName;
  let promise = new Promise(() => {});
  let unSubCall = null;
  let unSubIce = null;

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = getFirestore(app);

  // Initialize Firesbase Auth
  const auth = getAuth(app);
  authObj.set(auth);
  onAuthStateChanged(auth, (u) => {
    if (u) {
      user.set(u);
      loaded.set(true);
      loggedIn.set(true);
    } else {
      loaded.set(true);
      loggedIn.set(false);
    }
  });

  // add own ICE candidates to the database and retrieve peer's ICE candidates from database
  async function collectIceCandidates() {
    peerConnection.addEventListener("icecandidate", (e) => {
      // listening to addition in own ICE candidate's list
      if (e.candidate) {
        const json = e.candidate.toJSON();
        addDoc(collection(db, "rooms", roomId, localName), json); // adding on ICE candidates to database
      }
    });
    unSubIce = onSnapshot(
      collection(db, "rooms", roomId, remoteName),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log("adding ice ;)"); // adding peer's ICE candidates after fetching them from database
            const candidate = new RTCIceCandidate(change.doc.data());
            peerConnection.addIceCandidate(candidate);
          }
        });
      }
    );
  }

  async function createRoom() {
    caller.set(true);
    if (peerConnection.signalingState == "closed") {
      // after disconnecting from a previous session
      peerConnection = null;
      peerConnection = new RTCPeerConnection(configuration); // create a new peerConnection
    }
    peerConnection.createDataChannel("probe"); // bitch

    const roomRef = doc(collection(db, "rooms"));
    roomId = roomRef.id;

    localName = "caller";
    remoteName = "callee";

    collectIceCandidates();
    registerPeerConnectionListeners(peerConnection); // bitch 2
    peerConnection.addEventListener("datachannel", (event) => {
      console.log("Datachannel detected: ", event.channel.label);

      if (event.channel.label == "main") {
        connected.set(true);
        waiting.set(true);
        event.channel.addEventListener("open", (event) => {
          console.log("Channel opened");
          $dataChannel.send(`:name ${$user.displayName}`); // exchange names
        });

        // Disable input when closed
        event.channel.addEventListener("close", (event) => {
          console.log("Channel closed");
          messages.update((arr) => [
            ...arr,
            {
              name: "@system",
              message: "peer disconnected. hanging up...", // host
              received: true,
              help: true,
            },
          ]);
          setTimeout(hangUp, 1000);
        });
        event.channel.addEventListener("message", (event) => {
          var seek = /:seek \d+.\d*/;
          console.log("Message received: " + event.data);
          if ($peerName != null) {
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
        dataChannel.set(event.channel);
      }
    });

    // Code for creating a room

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };

    await setDoc(roomRef, roomWithOffer);

    // Listening for remote session description below
    unSubCall = onSnapshot(doc(db, "rooms", roomId), async (doc) => {
      console.log("Got updated room:", doc.data());
      const data = doc.data();
      if (!peerConnection.currentRemoteDescription && data.answer) {
        console.log("Set remote description");
        const answer = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(answer);
      }
    });
    // Listen for remote ICE candidates below
    waiting.set(true);
    return roomId;
  }

  async function joinRoomById(roomId) {
    caller.set(false);
    if (peerConnection.signalingState == "closed") {
      peerConnection = null;
      peerConnection = new RTCPeerConnection(configuration);
    }
    const roomRef = doc(db, "rooms", roomId);
    const roomSnapshot = await getDoc(roomRef);
    console.log("Got room:", roomSnapshot.exists());

    if (roomSnapshot.exists()) {
      localName = "callee";
      remoteName = "caller";

      var channel = peerConnection.createDataChannel("main"); // bitch
      channel.addEventListener("open", (event) => {
        console.log("Channel opened");
        connected.set(true);
        $dataChannel.send(`:name ${$user.displayName}`); // exchange each other's names
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
      dataChannel.set(channel);
      collectIceCandidates();
      registerPeerConnectionListeners(peerConnection);

      // Code for creating SDP answer below
      const offer = roomSnapshot.data().offer;
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await updateDoc(doc(db, "rooms", roomId), roomWithAnswer);
      return 0;
    } else {
      alert("error: room not found :(");
      joining.set(false);
      promise = new Promise(() => {});
    }
  }

  async function hangUp(e) {
    if (!$connected && !$waiting) {
      // prevent multiple hangUp  calls
      return;
    }
    hanging = true; // start modal

    if (!$caller && $dataChannel.readyState == "open") {
      $dataChannel.send("bye bye");
    } else {
      // Delete room on hangup

      if (roomId) {
        const calleeCandidates = await getDocs(
          collection(db, "rooms", roomId, "callee")
        );
        calleeCandidates.docs.forEach(async (candidate) => {
          await deleteDoc(candidate.ref);
        });
        const callerCandidates = await getDocs(
          collection(db, "rooms", roomId, "caller")
        );
        callerCandidates.docs.forEach(async (candidate) => {
          await deleteDoc(candidate.ref);
        });
        if (unSubCall) {
          unSubCall();
        }
        await deleteDoc(doc(db, "rooms", roomId));
      }
    }
    if (peerConnection) {
      peerConnection.close();
    }
    unSubIce();
    connected.set(false);
    waiting.set(false);
    files.set(null);
    creating.set(false);
    joining.set(false);
    dataChannel.set(null);
    peerName.set(null);
    promise = new Promise(() => {});
    setTimeout(() => {
      messages.set([]);
      hanging = false; // removing modal
    }, 500);
  }

  const create = () => {
    promise = createRoom();
  };
  const join = (e) => {
    roomId = e.detail.roomId;
    promise = joinRoomById(e.detail.roomId);
  };
</script>

<TopPanel {auth} />
<main class="background">
  <section>
    <Screen />
    <Dashboard on:create={create} on:join={join} on:hangup={hangUp} {promise} />
  </section>
</main>
<Auth {auth} />
<LoadingModal visible={hanging} />

<style>
  main {
    box-sizing: border-box;
    height: 90%;
    overflow-y: auto;
    padding: 1rem;
  }
  section {
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
  }
  @media screen and (max-width: 720px) {
    section {
      flex-direction: column;
    }
  }
</style>
