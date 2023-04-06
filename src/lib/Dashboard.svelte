<script>
  import { chatOpen, connected } from "../assets/js/store";
  import Chatbox from "./components/Chatbox.svelte";
  import Room from "./components/Room.svelte";
  import Waiting from "./components/Waiting.svelte";

  $: invisible = $chatOpen;
  export let promise = new Promise(() => {});

  //let promise = new Promise(() => {});
</script>

<aside class="primary-dark wrapper" class:invisible>
  <section class="content">
    {#await promise}
      <Room on:create on:join />
    {:then number}
      {#if number}
        {#if !$connected}
          <Waiting roomId={number} on:hangup />
        {:else}
          <Chatbox />
        {/if}
      {:else}
        <Chatbox />
      {/if}
    {/await}
  </section>
</aside>

<style>
  .wrapper {
    width: 40vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .invisible {
    display: none !important;
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
    border-radius: 0.5rem;
  }
  @media screen and (max-width: 720px) {
    .card {
      width: 100%;
      height: 58vh;
      box-sizing: border-box;
      margin: 1rem 0;
    }
  }
</style>
