<script>
  import { signOut } from "firebase/auth";
  import { loggedIn, connected, waiting, authObj } from "../assets/js/store";

  $: visible = $loggedIn;

  const handleSignOut = async () => {
    if ($connected || $waiting) {
      alert("Please hang-up before logging out :)");
      return;
    }
    var x = await confirm("Log out?");
    if (!x) return;
    signOut($authObj)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  export let on_primary = true;
</script>

<header
  class={on_primary ? "primary on-primary-text" : "primary-dark primary-text"}
>
  <h1 on:click={handleSignOut} on:keydown={handleSignOut}>vidsync</h1>
  <!-- <section>
    <a
      href="https://github.com/stravo1/vidsync"
      target="_blank"
      rel="noreferrer"><span class="material-symbols-rounded"> code </span></a
    >
    <span
      on:click={handleSignOut}
      on:keydown={handleSignOut}
      class="material-symbols-rounded logOut"
      class:visible
    >
      logout
    </span>
  </section> -->
</header>

<style>
  header {
    display: flex;
    padding: 0 3rem;
    height: 10%;
    /* justify-content: space-between;
    align-items: center; */
  }
  h1 {
    font-size: 30px;
  }

  /* section {
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
  } */
</style>
