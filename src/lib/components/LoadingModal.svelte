<script>
  import Spinner from "./Spinner.svelte";

  export let visible = false;
</script>

<div class="modal" class:visible />
<div class="wrapper" class:visible>
    <div class="center loadingCard secondary on-secondary-text" class:visible>
        <Spinner /> Loading...
      </div>
</div>

<style>
  .wrapper, .modal {
    display: none;
    position: fixed;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    top: 0;
  }
  .modal {
    opacity: 0.7;
    background-color: black;
  }
  .loadingCard {
    display: none;
    gap: 1rem;
    width: 25vw;
    height: 6rem;
    margin: 45vh auto;
    padding: 2.5rem;
    box-sizing: border-box;
    border-radius: 1rem;
  }
  .visible {
    display: block !important;
  }
</style>
