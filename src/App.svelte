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
    firebaseConfig,
    registerChannelEventListeners,
    // to listen for "open", "close" and "message" events on a channel
    registerPeerConnectionListeners,
    // to listen for connection, signalling and ICE gathering state changes
  } from "./assets/js/misc";
  import {
    authObj,
    caller,
    chatOpen,
    connected,
    creating,
    dataChannel,
    files,
    joining,
    loaded,
    loggedIn,
    messages,
    micPermissions,
    peerName,
    user,
    waiting,
  } from "./assets/js/store";
  import Auth from "./lib/Auth.svelte";
  import LoadingModal from "./lib/components/LoadingModal.svelte";
  import { onMount } from "svelte";

  // ICE server configuration with Google's public STUN servers for WebRTC connection
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

  // create a new RTCPeerConnection instance with above configuration
  let peerConnection = new RTCPeerConnection(configuration);

  /* local app states */

  let hanging = false;
  // true when previous session has disconnected and necessary actions (firebase room deletion etc.) is being taken
  // responsible for showing the loading modal when those tasks are being done

  let roomId = null;
  // roomId for the session

  let localName;
  let remoteName;
  // these variables keep track which database on firebase has to be accessed and which has to be updated
  // necessary for adding own ICE servers to the peer's server list

  let promise = new Promise(() => {});
  // used for switching between Room, Waiting and Chatbox windows with the help of `await` blocks in svelte

  let unSubCall = null;
  let unSubIce = null;
  // used for unsubscribing from firestore listeners
  // unSubCall unsubscribes the listener listening to the changes in the `roomId` document (for answer and offer SDPs)
  // unSubIce unsubscribes the listener listening to the changes to the peer's ICE server list

  let mic;
  let sender;
  let track;

  onMount(() => {
    mic = document.getElementById("mic");
  });
  // audio element for enabling audio comms
  const app = initializeApp(firebaseConfig);
  // Initialize Firebase

  const db = getFirestore(app);
  // Initialize Firestore

  const auth = getAuth(app);
  // Initialize Firesbase Auth

  authObj.set(auth);
  onAuthStateChanged(auth, (u) => {
    // listens for auth state changes
    if (u) {
      user.set(u);
      // sets the current user in the store
      loaded.set(true);
      // loaded state is used for displaying the LoadingModal when firebase tries to figureout if the user is logged in or not
      loggedIn.set(true);
    } else {
      loaded.set(true);
      loggedIn.set(false);
    }
  });

  /* adds own ICE candidates to the database and retrieve peer's ICE candidates from database */
  async function collectIceCandidates() {
    peerConnection.addEventListener("icecandidate", (e) => {
      // listening to addition in own ICE candidate's list
      if (e.candidate) {
        const json = e.candidate.toJSON();
        addDoc(collection(db, "rooms", roomId, localName), json); // adding own ICE candidates to database
      }
    });
    unSubIce = onSnapshot(
      // listen for changes in peer's database
      collection(db, "rooms", roomId, remoteName),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (
            change.type === "added" &&
            peerConnection.remoteDescription != null && // for un-deleted ICE candidates which might have remained in the database
            peerConnection.localDescription != null // until SDPs are set, don't accpet these ICE candidates, after SDPs are set, fresh candidates are updated
          ) {
            // if new candidate has been added then
            const candidate = new RTCIceCandidate(change.doc.data());

            peerConnection
              .addIceCandidate(candidate)
              .then(() => console.log("adding ice ;)"))
              .catch(() => console.log("Error adding ICE candidates."));
            // add peer's ICE candidates after fetching them from database
          }
        });
      }
    );
  }
  async function setMic(fresh = false) {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      localStream.getAudioTracks().forEach((audioTrack) => {
        if (fresh) sender = peerConnection.addTrack(audioTrack, localStream);
        sender.replaceTrack(audioTrack);
        track = audioTrack;
      });
      micPermissions.set(true);
    } catch (err) {
      console.log("Couldn't get permissions");
      alert("Premission denied :(\nCalls won't work.");
      micPermissions.set(false);
    }
  }

  /* function to create room */
  async function createRoom() {
    caller.set(true);
    // caller state keeps track whether user is the caller or the callee for the current session
    if (peerConnection.signalingState == "closed") {
      // after disconnecting from a previous session
      peerConnection = null;
      // discard all previous links
      peerConnection = new RTCPeerConnection(configuration);
      // create a new peerConnection
    }
    peerConnection.createDataChannel("probe"); // bitch -_-
    // ICE servers wont connect unless there's a channel or a track on the peerConnection
    // took me a considerable amount time to figure that out... bitch...
    // have to set a demo channel so that ICE senpai gave me attention uwu

    await setMic(true);

    roomId = $user.uid;
    // setting roomId as the user.uid to make sure there's only a single room on the database per user no matter what
    // even if a user reloads the page without hanging up still the next time that user will rewrite the previous room (although might cause few errors)
    // no storage wasted
    localName = "caller";
    remoteName = "callee";

    collectIceCandidates();
    registerPeerConnectionListeners(peerConnection, mic); // bitch 2

    /* listen to creation of "main" channel (which the callee creates) */
    peerConnection.addEventListener("datachannel", (event) => {
      console.log("Datachannel detected: ", event.channel.label);

      if (event.channel.label == "main") {
        // only the "main" channel
        connected.set(true);
        // for the caller detection of this channel itself means connection is complete
        waiting.set(false);
        // sets the waiting flag as false as we're already connected, useful for hanging up right in the waiting state (more info in the hangUp funciton)
        dataChannel.set(event.channel);
        // the dataChannel state is used accross the app to send messages
        registerChannelEventListeners(event.channel, hangUp);
        // register all required channel event listeners
      }
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // create an offer SDP

    /* the json data to be sent to the database */
    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };

    await setDoc(doc(db, "rooms", $user.uid), roomWithOffer);
    // create the room in database

    /* Listening for remote peer's answer SDP below */
    unSubCall = onSnapshot(doc(db, "rooms", roomId), async (doc) => {
      console.log("Got updated room:", doc.data());
      const data = doc.data();
      if (!peerConnection.currentRemoteDescription && data.answer) {
        console.log("Set remote description");
        const answer = new RTCSessionDescription(data.answer);
        // extract the answer SDP from the data fetched
        await peerConnection.setRemoteDescription(answer);
        // set the remote SDP
      }
    });

    waiting.set(true);
    // sets the waiting flag as true as cuurently we'll be waiting after giving the roomId

    return roomId;
  }

  /* as the name suggests... */
  async function joinRoomById(roomId) {
    caller.set(false);
    // not the caller but callee as we're the ones joining the already created room
    if (peerConnection.signalingState == "closed") {
      // again, if the previous session ended
      peerConnection = null;
      // clear up all prev. connection information
      peerConnection = new RTCPeerConnection(configuration);
      // and create a new one
    }
    const roomRef = doc(db, "rooms", roomId);
    const roomSnapshot = await getDoc(roomRef);
    // get the `roomId` document from the database

    if (roomSnapshot.exists()) {
      console.log("Room exists");

      localName = "callee";
      remoteName = "caller";

      var channel = peerConnection.createDataChannel("main"); // bitch
      // create the "main" channel
      await setMic(true);
      dataChannel.set(channel);

      registerChannelEventListeners(channel, hangUp);
      collectIceCandidates();
      registerPeerConnectionListeners(peerConnection, mic);
      // blah blah blah

      const offer = roomSnapshot.data().offer;
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      // create SDP answer

      /* same as creation */
      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await updateDoc(doc(db, "rooms", roomId), roomWithAnswer);
      // update the `roomId` document with the answer SDP for caller to catch it and complete connection
      return 0;
      // returning 0 as this will signal Dashboard component to switch to the Chatbox window directly
    } else {
      alert("error: room not found :(");
      joining.set(false);
      // joining (and creating) state is used to keep track of the joining and creation of room statuses
      promise = new Promise(() => {});
      // reset the promise as we couldn't join (although the promise resolved which would have resulted in change in Dashboard)
    }
  }

  async function hangUp(e) {
    if (!$connected && !$waiting) {
      // prevent multiple hangUp  calls as if not connected anymore then no use of re-running this fucntion
      // multiple calls are made for the device which presses the hangup button as hangUp function is called
      // two times: once in response to the button click and the other time when the channel closes
      // (as channel close automatically calls hangUp no matter what)
      //
      // waiting flag checks whether the app is in waiting state or not after creation of room, if so then we are not connected
      // but we still do need to run the hangUp function
      return;
    }
    hanging = true; // start the loading modal

    if (!$caller && $dataChannel.readyState == "open") {
      $dataChannel.send("bye bye");
      // if the callee is hanging up first then it sends a "bye bye" message
    } else {
      /* delete room from database */
      if (roomId) {
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
        if (unSubCall) {
          unSubCall();
        }
        await deleteDoc(doc(db, "rooms", roomId));
        // delete the room from database
      }
    }
    if (peerConnection) {
      peerConnection.close();
      // close the connection
    }
    unSubIce();
    connected.set(false);
    waiting.set(false);
    files.set(null);
    creating.set(false);
    joining.set(false);
    dataChannel.set(null);
    peerName.set(null);
    chatOpen.set(false);
    promise = new Promise(() => {});
    // reset all store values
    setTimeout(() => {
      // using setTimeout to make sure no messages remain after hangup
      // to make sure the 'peer disconnected' message doesn't remain after hangup
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
  const mute = () => {
    if (track) {
      track.stop();
    }
  };
  const unmute = async () => {
    await setMic();
  };
</script>

<main class="background">
  <section>
    <Screen on:hangup={hangUp} on:mute={mute} on:unmute={unmute} />
    {#if !$loggedIn}
      <Auth {auth} />
    {:else}
      <Dashboard
        on:create={create}
        on:join={join}
        on:hangup={hangUp}
        {promise}
      />
    {/if}
  </section>
  <audio id="mic" />
</main>
<LoadingModal visible={hanging} />

<style>
  main {
    box-sizing: border-box;
    /*overflow-y: auto;*/
    height: 100vh;
  }
  section {
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
