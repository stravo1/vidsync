<script>
  import { createEventDispatcher } from "svelte";
  import { creating, joining } from "../../assets/js/store";

  import kitty from "../../assets/images/dog-jump.svg";
  import Spinner from "./Spinner.svelte";
  import TopPanel from "../TopPanel.svelte";

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
  <TopPanel on_primary={false} />
  <div class="center">
    <img src={kitty} alt=":)" />
  </div>
  <section class="on-primary-text-dark info">
    <h2>
      join a room
      <span class="small">→</span>
    </h2>
  </section>
  <div class="button-sm">
    <input
      class="roomId on-primary-container-dark"
      type="text"
      placeholder="enter room id"
      bind:value={roomId}
      disabled={$creating || $joining}
    />
    <div on:click={join} on:keypress={join} class="on-primary-container-dark">
      {#if $joining}
        <Spinner dark={true} />
      {:else}
        <span class="material-symbols-rounded"> check_small </span>
      {/if}
    </div>
  </div>
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
  <button
    class="primary-dark on-secondary-text-dark create-small center"
    on:click={create}
    disabled={$creating || $joining}
  >
    {#if $creating}
      <Spinner dark={true} />
    {/if}
    {#if $creating}creating {:else}← create room{/if}
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
    margin-top: 3rem;
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
    margin-top: 1rem;
  }
  .roomId:disabled {
    cursor: not-allowed;
  }
  .roomId::placeholder {
    font-family: "Space Grotesk", monospace;
  }
  .roomId:focus {
    outline: none;
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
  .small {
    display: none;
  }
  .create-small {
    display: none;
  }
  .button-sm > div {
    display: none;
  }
  @media screen and (max-width: 720px) {
    .wrapper {
      width: 100vw;
      height: 100vh;
      max-width: unset;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: end;
      position: relative;
    }
    .info {
      color: var(--md-sys-color-primary);
    }
    .small {
      display: inline;
    }
    img {
      margin-bottom: 3rem;
    }
    h2 {
      font-size: 40px;
      margin-left: 2.5rem;
      font-weight: bold;
    }
    .roomId {
      padding-left: 2.5rem;
      margin: 1rem 0 3rem 0;
      border-radius: 0;
    }
    .roomId::placeholder {
      opacity: 0.5;
    }
    .create {
      display: none;
    }
    .join {
      display: none;
    }
    .divider {
      display: none;
    }
    .create-small {
      display: block;
      font-weight: 500;
      text-align: right;
      margin-bottom: 1rem;
    }
    .button-sm {
      display: flex;
    }
    .button-sm > div {
      display: flex;
      align-items: center;
      padding-right: 1rem;
      margin: 1rem 0 3rem 0;
    }
    .button-sm > div:hover {
      cursor: pointer;
    }
    .button-sm > div > span {
      display: block;
      color: #660026;
      opacity: 0.5;
    }
  }
</style>
