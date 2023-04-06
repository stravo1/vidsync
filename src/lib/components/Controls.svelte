<script>
  import { createEventDispatcher } from "svelte";
  import { messages, micPermissions, chatOpen } from "../../assets/js/store";

  let dispatch = createEventDispatcher();
  let mute = false;

  const handleMic = () => {
    if (mute) {
      dispatch("unmute");
    } else {
      dispatch("mute");
    }
    mute = !mute;
  };
  const hangup = () => {
    var sure = confirm("Leave room?");
    if (!sure) return;
    messages.update((arr) => [
      ...arr,
      {
        name: "@system",
        message: "hanging up, please wait...",
        received: false,
        help: true,
      },
    ]);
    dispatch("hangup");
  };
  const setChat = () => {
    chatOpen.set(!$chatOpen);
  };
</script>

<div class="controls">
  {#if $micPermissions}
    <div
      class="on-primary-container-dark button center"
      on:click={handleMic}
      on:keypress={handleMic}
    >
      <span class="material-symbols-rounded primary-text">
        {#if mute}
          mic_off
        {:else}
          mic
        {/if}
      </span>
    </div>
  {/if}

  <div
    class="on-primary-container-dark button center"
    on:click={hangup}
    on:keypress={hangup}
  >
    <span class="material-symbols-rounded primary-text"> call_end</span>
  </div>

  <div
    class={$chatOpen
      ? "on-primary-container-dark button center"
      : "on-primary-dark button center"}
    on:click={setChat}
    on:keypress={setChat}
  >
    <span class={!$chatOpen ? "material-symbols-rounded on-primary-container-text-dark" : "material-symbols-rounded primary-text"}> message</span>
  </div>
</div>

<style>
  .controls {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 5rem;
    justify-content: center;
    align-items: flex-start;
    display: flex;
    gap: 2rem;
    z-index: 999;
  }
  .controls > .button {
    border-radius: 10px;
    height: 52px;
    width: 52px;
    flex-direction: column;
    opacity: 0.5;
    transition: all 250ms ease-in-out;
  }
  .controls:hover .button {
    opacity: 1;
  }
  .button:hover {
    cursor: pointer;
  }
  .button > span {
    font-size: 28px;
    display: block;
  }
</style>
