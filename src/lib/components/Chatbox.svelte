<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { commandInterpreter } from "../../assets/js/misc";
  import { dataChannel, messages, micPermissions } from "../../assets/js/store";
  import ChatBubble from "./ChatBubble.svelte";

  let dispatch = createEventDispatcher();
  let box;
  let text;
  let mute = false;

  const handleMic = () => {
    if (mute) {
      dispatch("unmute");
    } else {
      dispatch("mute");
    }
    mute = !mute;
  };
  onMount(() => {
    box = document.getElementsByClassName("box")[0];
  });

  const sendMessage = () => {
    $dataChannel.send(text);
    messages.update((arr) => [
      ...arr,
      {
        name: "me",
        message: text,
        received: false,
        help: false,
      },
    ]);
    var cmd = /^:.+/;
    if (cmd.test(text)) {
      commandInterpreter(text);
    }

    text = "";
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
  const unsub = messages.subscribe((val) => {
    if (box != undefined) {
      setTimeout(() => {
        box.scrollTop = box.scrollHeight;
      }, 250);
    }
  });
  onDestroy(unsub);
</script>

<section class="wrapper">
  <section class="top on-surface-variant-text">
    <h3>messages</h3>
    <div class="controls">
      {#if $micPermissions}
        <div class="mic">
          <span
            class="material-symbols-rounded unselectable"
            on:click={handleMic}
            on:keypress={handleMic}
          >
            {#if mute}
              mic_off
            {:else}
              mic
            {/if}
          </span>
        </div>
      {/if}
      <div class="hangup">
        <span
          class="material-symbols-rounded unselectable"
          on:click={hangup}
          on:keypress={hangup}
        >
          power_rounded
        </span>
      </div>
    </div>
  </section>
  <div class="box">
    {#each $messages as message}
      <ChatBubble
        name={message.name}
        message={message.message}
        received={message.received}
        help={message.help}
      />
    {/each}
  </div>
  <div class="input">
    <input
      bind:value={text}
      on:keypress={(e) => {
        if (e.key == "Enter") {
          sendMessage();
        }
      }}
      type="text"
      class="on-surface-variant"
      placeholder="enter message"
    />
    <button class="send center error on-error-text" on:click={sendMessage}>
      <span class="material-symbols-rounded"> send </span>
    </button>
  </div>
</section>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 350px;
    height: 100%;
    width: 100%;
  }
  .top {
    flex-basis: 5%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h3 {
    margin: 0.5rem 0;
  }
  .controls {
    display: flex;
    gap: 0.75rem;
  }
  .hangup,
  .mic {
    cursor: pointer;
  }
  .box {
    flex-basis: 90%;
    box-sizing: border-box;
    overflow: scroll;
    border: 2px white;
    border-style: none;
    border-radius: 0.5rem;
    margin: 1rem 0;
    scroll-behavior: smooth;
  }
  .input {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }
  input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.65rem;
    border-radius: 0.25rem;
    border: none;
    font-family: "Martian Mono", monospace;
  }
  input::placeholder {
    font-family: "Martian Mono", monospace;
  }
  .send {
    padding: 0.25rem 0.5rem;
    font-size: large;
    border-radius: 0.25rem;
    border: none;
    font-family: "Martian Mono", monospace;
    cursor: pointer;
    transition: all;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
  }
</style>
