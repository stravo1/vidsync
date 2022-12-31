<script>
  import { connected } from "../assets/js/store";
  import Chatbox from "./components/Chatbox.svelte";
  import Room from "./components/Room.svelte";
  import Waiting from "./components/Waiting.svelte";

  export let promise = new Promise(() => {});

  //let promise = new Promise(() => {});
</script>

<aside class="surface-variant card">
  <section class="content">
    {#await promise}
      <Room on:create on:join />
    {:then number}
      {#if number}
        {#if !$connected}
          <Waiting roomId={number} on:hangup />
        {:else}
          <Chatbox on:hangup on:hangup on:mute on:unmute />
        {/if}
      {:else}
        <Chatbox on:hangup on:mute on:unmute />
      {/if}
    {/await}
  </section>
</aside>

<style>
  .card {
    display: flex;
    flex-direction: column;
    min-width: 240px;
    width: 25%;
    height: 100%;
    box-sizing: border-box;
    padding: 1rem;
    border-radius: 1rem;
    filter: drop-shadow();
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
