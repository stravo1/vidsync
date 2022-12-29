<script>
  import { signOut } from "firebase/auth";
  import { loggedIn } from "../assets/js/store";

  $: visible = $loggedIn;
  export let auth;

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
</script>

<header class="background on-background-text">
  <h1>vidsync</h1>
  <section>
    <span class="material-symbols-rounded"> help </span>
    <span
      on:click={handleSignOut}
      on:keydown={handleSignOut}
      class="material-symbols-rounded logOut"
      class:visible
    >
      logout
    </span>
  </section>
</header>

<style>
  header {
    height: 10%;
    display: flex;
    padding: 0 2rem;
    justify-content: space-between;
    align-items: center;
  }
  section {
    display: flex;
    gap: 0 2rem;
  }
  .material-symbols-rounded {
    cursor: pointer;
  }
  .logOut {
    display: none;
  }
  .visible {
    display: block !important;
  }
</style>
