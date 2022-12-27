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
  import { commandInterpreter, firebaseConfig } from "./assets/js/misc";
  import {
    caller,
    connected,
    creating,
    dataChannel,
    joining,
    messages,
  } from "./assets/js/store";

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

  async function collectIceCandidates() {
    peerConnection.addEventListener("icecandidate", (e) => {
      if (e.candidate) {
        const json = e.candidate.toJSON();
        addDoc(collection(db, "rooms", roomId, localName), json);
      }
    });
    unSubIce = onSnapshot(
      collection(db, "rooms", roomId, remoteName),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log("adding ice ;)");
            const candidate = new RTCIceCandidate(change.doc.data());
            peerConnection.addIceCandidate(candidate);
          }
        });
      }
    );
  }

  async function createRoom() {
    if (peerConnection.signalingState == "closed") {
      peerConnection = null;
      peerConnection = new RTCPeerConnection(configuration);
    }
    peerConnection.createDataChannel("probe"); // bitch

    const roomRef = doc(collection(db, "rooms"));
    roomId = roomRef.id;

    localName = "caller";
    remoteName = "callee";

    collectIceCandidates();
    registerPeerConnectionListeners(); // bitch 2

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
    return roomId;
  }

  async function joinRoomById(roomId) {
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
        console.log("Message received: " + event.data);
        messages.update((arr) => [
          ...arr,
          {
            name: "host",
            message: event.data,
            received: true,
            help: false,
          },
        ]);
        var cmd = /:.+/;
        if (cmd.test(event.data)) {
          commandInterpreter(event.data);
        }
      });
      dataChannel.set(channel);
      collectIceCandidates();
      registerPeerConnectionListeners();

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
    if (!$caller) {
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
    creating.set(false);
    joining.set(false);
    dataChannel.set(null);
    promise = new Promise(() => {});
    setTimeout(() => {
      messages.set([]);
    }, 500);
  }

  function registerPeerConnectionListeners() {
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
    peerConnection.addEventListener("datachannel", (event) => {
      console.log("Datachannel detected: ", event.channel.label);

      if (event.channel.label == "main") {
        connected.set(true);
        caller.set(true);
        event.channel.addEventListener("open", (event) => {
          console.log("Channel opened");
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
          console.log("Message received: " + event.data);
          messages.update((arr) => [
            ...arr,
            {
              name: "guest",
              message: event.data,
              received: true,
              help: false,
            },
          ]);
          var cmd = /:.+/;
          if (cmd.test(event.data)) {
            commandInterpreter(event.data);
          }
        });
        dataChannel.set(event.channel);
      }
    });
  }
  const create = () => {
    promise = createRoom();
  };
  const join = (e) => {
    roomId = e.detail.roomId;
    promise = joinRoomById(e.detail.roomId);
  };
</script>

<TopPanel />
<main class="background">
  <section>
    <Screen />
    <Dashboard on:create={create} on:join={join} on:hangup={hangUp} {promise} />
  </section>
</main>

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
