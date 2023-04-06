<script>
  import image from "../assets/images/unboxing.png";
  import {
    browserLocalPersistence,
    GoogleAuthProvider,
    setPersistence,
    signInWithPopup,
  } from "firebase/auth";
  import { loaded, loggedIn } from "../assets/js/store";
  import LoadingModal from "./components/LoadingModal.svelte";

  export let auth;

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
  const scroll = () => {
    var main = document.getElementsByTagName("main")[0];
    main.scrollTop = 0;
  };
</script>

<div class={!loading ? "wrapper primary-dark" : "loading"}>
  <div on:click={scroll} on:keypress={scroll} class="scroll primary-text">
    ↑
  </div>
  <div class="contain" class:loading>
    <div class="image center">
      <img src={image} alt="log in" />
    </div>
    <div
      class="title primary-text"
      on:click={hadnleSignIn}
      on:keypress={hadnleSignIn}
    >
      Continue with Google →
    </div>
  </div>
</div>
<LoadingModal visible={loading} />

<style>
  .loading {
    display: none !important;
  }
  .contain {
    margin: 2rem;
  }
  .wrapper {
    width: 40vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  .image {
    margin: 3rem;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }
  img {
    width: 100%;
    max-width: 250px;
    object-fit: cover;
  }
  .title {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    margin: 1rem 0;
  }
  .title:hover {
    cursor: pointer;
    text-decoration: underline;
    text-decoration-thickness: 0.25rem;
  }
  @media screen and (max-width: 720px) {
    .wrapper {
      width: 100vw;
      height: 100vh;
    }
    .scroll {
      display: block;
      position: absolute;
      top: 0;
      right: 50%;
      font-size: 40px;
      font-weight: bold;
      margin-top: 1rem;
    }
    .scroll:hover {
      cursor: pointer;
    }
  }
</style>
