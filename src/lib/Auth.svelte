<script>
  import image from "../assets/images/31.svg";
  import {
    browserLocalPersistence,
    GoogleAuthProvider,
    setPersistence,
    signInWithPopup,
  } from "firebase/auth";
  import { loaded, loggedIn } from "../assets/js/store";
  import LoadingModal from "./components/LoadingModal.svelte";

  export let auth;
  $: invisible = $loggedIn;
  $: loading = !$loaded;

  const provider = new GoogleAuthProvider();
  const hadnleSignIn = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };
</script>

<div class="modal" class:invisible />
<div class="wrapper" class:invisible>
  <div class="card secondary-container" class:loading>
    <div class="image center">
      <img src={image} alt="log in" />
    </div>
    <div class="title on-secondary-container-text">
      <h2>welcome!</h2>
      looks like you're not signed in...
    </div>
    <button on:click={hadnleSignIn} class="google on-secondary-container"
      >Sign in with Google</button
    >
  </div>
</div>
<LoadingModal visible={loading} />

<style>
  .invisible {
    display: none;
  }
  .loading {
    display: none !important;
  }
  .wrapper,
  .modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    top: 0;
  }
  .modal {
    opacity: 0.8;
    background-color: black;
  }
  .card {
    width: 40vw;
    height: 75vh;
    padding: 1.5rem 1rem;
    box-sizing: border-box;
    opacity: 1;
    z-index: 10;
    color: wheat;
    margin: 10vh auto;
    min-width: 320px;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .image {
    flex-basis: 70%;
    width: 100%;
    overflow: hidden;
  }
  img {
    width: 100%;
    scale: 1.25;
    object-fit: cover;
  }
  .title {
    flex-basis: 15%;
    text-align: center;
    margin: 1rem 0;
  }
  button {
    padding: 0.5rem;
    gap: 0.5rem;
    font-size: medium;
    border-radius: 0.5rem;
    border: none;
    font-family: "Martian Mono", monospace;
    cursor: pointer;
    transition: all;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
  }
  button:hover {
    filter: drop-shadow(5px 10px 5px rgba(0, 0, 0, 0.25));
  }
  .google {
    flex-basis: 15%;
  }
  @media screen and (max-width: 720px) {
    img {
      height: 100%;
      scale: 1;
    }
    .title {
      font-size: smaller;
    }
  }
</style>
