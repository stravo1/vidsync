<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import connect from "../../assets/images/doggy.gif";
  import ClipboardJS from "clipboard/dist/clipboard.min.js";
  import TopPanel from "../TopPanel.svelte";

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
    }, 600);
  };
</script>

<div class="wrapper">
  <TopPanel on_primary={false} />
  <div class="center">
    <img src={connect} alt=":)" />
  </div>
  <section class="on-primary-text-dark info">
    <h2>
      waiting
      <span class="big">...</span><span class="small">→</span>
    </h2>
    <span class="big">here's your room id:</span>
    <section
      id="copy"
      data-clipboard-text={roomId}
      class="roomIdHolder on-primary-container-dark on-surface-text"
    >
      <div class="roomId">{roomId}</div>
      <button
        data-clipboard-text={roomId}
        class="roomIdButton on-primary-container-dark on-surface-text"
        on:click={copyConfirm}
      >
        <span class="material-symbols-rounded on-primary-text-dark">
          copy_all
        </span>
      </button>
    </section>
    <button
      on:click={hangup}
      class="center hangup error-container-dark on-error-container-text-dark"
    >
      hang up
    </button>
    <button
      class="primary-dark on-secondary-text-dark hangup-small center"
      on:click={hangup}
    >
      ← hang up
    </button>
  </section>
</div>

<style>
  .wrapper {
    max-width: 375px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    overflow-x: hidden;
    margin: 2rem 1rem 1rem 1rem;
  }
  img {
    width: 100%;
    max-width: 350px;
  }
  .info {
    margin: 1rem 0;
  }
  h2 {
    font-size: 30px;
    margin: 0;
    margin-bottom: 0.5rem;
  }
  .roomIdHolder {
    display: flex;
    margin: 1.75rem 0 1rem 0;
    word-break: break-all;
    user-select: all;
    border-radius: 0.25rem;
    border: 2px #900038;
    border-style: dashed;
    font-size: small;
    padding: 0.5rem;
    font-weight: 500;
    color: #900038;
  }
  .roomId {
    flex-basis: 90%;
    padding: 0.5rem 0.25rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    opacity: 0.75;
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
    font-size: 24px;
    font-family: "Space Grotesk", monospace;
    font-weight: bold;
    cursor: pointer;
    transition: all;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
  }
  .material-symbols-rounded {
    font-variation-settings: "FILL" 0, "wght" 500, "GRAD" 200, "opsz" 48;
  }
  .roomId:hover {
    overflow: scroll;
  }
  .small {
    display: none;
  }
  @media screen and (max-width: 720px) {
    .wrapper {
      max-width: unset;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;
      margin: 0;
    }
    .small {
      display: inline;
    }
    .big {
      display: none;
    }
    .info {
      margin: 0;
    }
    h2 {
      font-size: 40px;
      color: var(--md-sys-color-primary);
      margin-left: 2.5rem;
    }
    img {
      max-width: 250px;
      margin-bottom: 3rem;
    }
    .roomIdHolder {
      border: none;
      border-radius: 0;
      padding-left: 2.5rem;
      margin: 1rem 0 3rem 0;
    }
    .hangup {
      display: none;
    }
    .hangup-small {
      display: block;
      font-weight: 500;
      text-align: right;
      margin-bottom: 1rem;
    }
  }
</style>
