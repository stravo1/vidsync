<script>
  import { createEventDispatcher } from "svelte";
  import { creating, joining } from "../../assets/js/store";

  import kitty from "../../assets/images/dog-jump.png";
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
  <section class="on-primary-text-dark info">
    <h2>join a room</h2>
  </section>
  <input
    class="roomId on-primary-container-dark"
    type="text"
    placeholder="enter room id"
    bind:value={roomId}
    disabled={$creating || $joining}
  />
  <button
    class="secondary on-secondary-text join primary-container-dark"
    on:click={join}
    disabled={$creating || $joining}
  >
    {#if $joining}
      <Spinner />
    {/if}
    {#if $joining}Joining{:else}Join{/if}
  </button>
  <div class="divider primary-container-text-dark">OR</div>
  <button
    class="secondary on-secondary-text create center primary-container-dark"
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
    max-width: 375px;
    height: fit-content;
    box-sizing: border-box;
    padding: 2rem;
    overflow-x: hidden;
    padding-bottom: 1rem;
  }
  .info {
    margin-top: 1rem;
  }
  img {
    width: 100%;
    max-width: 250px;
    object-fit: cover;
  }
  h2 {
    font-size: 30px;
    margin: 0;
  }
  .roomId {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    border-radius: 0.5rem;
    border: none;
    font-family: "Space Grotesk", monospace;
    font-weight: bold;
    font-size: 16px;
    color: #660026;
    margin: 1.5rem 0;
  }
  .roomId:disabled {
    cursor: not-allowed;
  }
  .roomId::placeholder {
    font-family: "Space Grotesk", monospace;
  }
  button {
    padding: 0.75rem;
    font-size: large;
    gap: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    font-family: "Space Grotesk", monospace;
    font-weight: bold;
    font-size: 24px;
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
</style>
