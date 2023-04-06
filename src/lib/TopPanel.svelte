<script>
  import { signOut } from "firebase/auth";
  import { loggedIn, connected, waiting, authObj } from "../assets/js/store";

  const handleSignOut = async () => {
    if (!on_primary) {
      var main = document.getElementsByTagName("main")[0];
      main.scrollTop = 0;
      return;
    }
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
  class={on_primary
    ? "primary on-primary-text"
    : "primary-dark primary-text small"}
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

  .small {
    display: none;
  }
  @media screen and (max-width: 720px) {
    h1 {
      font-size: 24px;
      margin-top: 1.25rem;
    }
    .small {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>
