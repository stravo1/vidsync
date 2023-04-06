<script>
  import Spinner from "./Spinner.svelte";

  export let visible = false;
</script>

<div class="modal" class:visible />
<div class="wrapper" class:visible>
  <div
    class="center loadingCard primary-container-dark on-primary-container-text-dark"
    class:visible
  >
    <Spinner /> &ensp; Loading...
  </div>
</div>

<style>
  .wrapper,
  .modal {
    display: none;
    position: fixed;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    top: 0;
    z-index: 1000;
  }
  .modal {
    opacity: 0.7;
    background-color: black;
  }
  .loadingCard {
    display: none;
    gap: 1rem;
    min-width: 15rem;
    width: 25vw;
    height: 6rem;
    margin: 45vh auto;
    padding: 2.5rem;
    box-sizing: border-box;
    border-radius: 1rem;
    font-weight: bold;
  }
  .visible {
    display: block !important;
  }
  .center {
    gap: 1rem;
  }
</style>
