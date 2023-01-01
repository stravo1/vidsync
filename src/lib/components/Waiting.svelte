<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import connect from "../../assets/images/14.svg";
  import ClipboardJS from "clipboard/dist/clipboard.min.js";

  let dispatch = createEventDispatcher();
  export let roomId;
  onMount(() => {
    new ClipboardJS(".roomIdButton");
  });

  const hangup = () => {
    var sure = confirm("Abandon room?");
    if (!sure) return;

    dispatch("hangup");
  };
  const copyConfirm = () => {
    let original = roomId;
    setTimeout(() => {
      roomId = "copied!";
    }, 100);
    setTimeout(() => {
      roomId = original;
    }, 1100);
  };
</script>

<div class="wrapper">
  <div class="center">
    <img src={connect} alt=":)" />
  </div>
  <section class="on-surface-variant-text info">
    <h2>waiting...</h2>
    room id:
    <section
      id="copy"
      data-clipboard-text={roomId}
      class="roomIdHolder on-surface-text"
    >
      <div class="roomId">{roomId}</div>
      <button
        data-clipboard-text={roomId}
        class="roomIdButton surface-variant on-surface-variant-text"
        on:click={copyConfirm}
      >
        <span class="material-symbols-rounded"> copy_all </span>
      </button>
    </section>
    <button on:click={hangup} class="center error on-error-text">
      hang up
    </button>
  </section>
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    overflow-x: hidden;
    margin: 2rem 0 1rem 0;
  }
  img {
    width: 90%;
    scale: 1.25;
  }
  .info {
    margin: 1rem 0;
    text-align: center;
  }
  .roomIdHolder {
    display: flex;
    margin: 0.25rem 0;
    word-break: break-all;
    user-select: all;
    border-radius: 0.25rem;
    border: 2px #cac4d0;
    border-style: dashed;
    font-size: small;
    padding: 0.5rem;
  }
  .roomId {
    flex-basis: 90%;
    padding: 0.5rem 0.25rem;
  }
  .roomIdButton {
    width: 2rem;
    margin: 0;
    padding: 0;
    font-size: small;
  }
  button {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem;
    margin: 1rem 0;
    gap: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    font-size: 16px;
    font-family: "Martian Mono", monospace;
    cursor: pointer;
    transition: all;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
  }
  .material-symbols-rounded {
    font-variation-settings: "FILL" 0, "wght" 500, "GRAD" 200, "opsz" 48;
  }
</style>
