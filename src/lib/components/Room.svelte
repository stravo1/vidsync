<script>
  import { createEventDispatcher } from "svelte";
  import { creating, joining } from "../../assets/js/store";

  import kitty from "../../assets/images/5.svg";
  import Spinner from "./Spinner.svelte";

  let roomId;
  const dispatch = createEventDispatcher();
  const create = () => {
    dispatch("create");
    creating.set(true);
  };
  const join = () => {
    if (!roomId) {
      alert("please provide room id.");
      return;
    }
    dispatch("join", {
      roomId: roomId,
    });
    joining.set(true);
  };
</script>

<div class="wrapper">
  <div class="center">
    <img src={kitty} alt=":)" />
  </div>
  <section class="on-surface-variant-text info">
    <h2>hello!</h2>
    join a room to continue
  </section>
  <input
    class="roomId"
    type="text"
    placeholder="Enter room id"
    bind:value={roomId}
    disabled={$creating || $joining}
  />
  <button
    class="secondary on-secondary-text join"
    on:click={join}
    disabled={$creating || $joining}
  >
    {#if $joining}
      <Spinner />
    {/if}
    {#if $joining}Joining{:else}Join{/if}
  </button>
  <div class="divider on-surface-variant-text">or</div>
  <button
    class="secondary on-secondary-text create center"
    on:click={create}
    disabled={$creating || $joining}
  >
    {#if $creating}
      <Spinner />
    {/if}
    Creat{#if $creating}ing {:else}e room{/if}
  </button>
</div>

<style>
  .wrapper {
    width: 100%;
    height: fit-content;
    box-sizing: border-box;
    margin: 2rem 0 1rem 0;
    overflow-x: hidden;
    padding-bottom: 1rem;
  }
  img {
    width: 90%;
    scale: 1.25;
  }
  .info {
    margin: 1rem 0;
    text-align: center;
  }
  .roomId {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: none;
    font-family: "Martian Mono", monospace;
    margin: 1rem 0 1rem 0;
  }
  .roomId:disabled {
    cursor: not-allowed;
  }
  .roomId::placeholder {
    font-family: "Martian Mono", monospace;
  }
  button {
    padding: 0.5rem;
    font-size: large;
    gap: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    font-family: "Martian Mono", monospace;
    cursor: pointer;
    opacity: 0.9;
    transition: all;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
  }
  button:hover {
    opacity: 1;
    filter: drop-shadow(5px 10px 5px rgba(0, 0, 0, 0.25));
  }
  button:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }
  button:hover:disabled {
    cursor: not-allowed;
    filter: none;
  }
  .join,
  .create {
    width: 100%;
  }
  .create {
    padding: 0.65rem;
  }
</style>
