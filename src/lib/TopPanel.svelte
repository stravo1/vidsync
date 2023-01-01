<script>
  import { signOut } from "firebase/auth";
  import { loggedIn, connected, waiting } from "../assets/js/store";

  $: visible = $loggedIn;
  export let auth;

  const handleSignOut = async () => {
    if ($connected || $waiting) {
      alert("Please hang-up before logging out :)");
      return;
    }
    var x = await confirm("Log out?");
    if (!x) return;
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
    <a href="https://github.com/stravo1/vidsync" target="_blank" rel="noreferrer"><span class="material-symbols-rounded"> code </span></a> 
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
