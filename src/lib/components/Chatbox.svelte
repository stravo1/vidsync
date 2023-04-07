<script>
  import { onDestroy, onMount } from "svelte";
  import { commandInterpreter } from "../../assets/js/misc";
  import { chatOpen, dataChannel, messages } from "../../assets/js/store";
  import ChatBubble from "./ChatBubble.svelte";

  let box;
  let text;

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

  const unsub = messages.subscribe((val) => {
    if (box != undefined) {
      setTimeout(() => {
        box.scrollTop = box.scrollHeight;
      }, 250);
    }
  });
  onDestroy(unsub);
  const scroll = () => {
    var main = document.getElementsByTagName("main")[0];
    main.scrollTop = 0;
    setTimeout(() => {
      chatOpen.set(true);
    }, 500);
  };
</script>

<section class="wrapper">
  <section class="top on-primary-text-dark">
    <h2>messages</h2>
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
      class="on-primary-container-dark"
      placeholder="enter message"
    />
    <button
      class="send center on-primary-container-dark primary-text"
      on:click={sendMessage}
    >
      <span class="material-symbols-rounded"> send </span>
    </button>
  </div>
  <button
    class="primary-dark on-secondary-text-dark goback-small center"
    on:click={scroll}
  >
    ← view player
  </button>
</section>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 350px;
    max-width: 375px;
    height: 100%;
    width: 90%;
    margin-bottom: 1rem;
  }
  .top {
    flex-basis: 5%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
  }
  .goback-small {
    display: none;
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
  }
  h2 {
    font-size: 30px;
    margin: 0;
    margin-bottom: 0.5rem;
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
  }
  input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem;
    border-radius: 10px;
    border: none;
    font-family: "Space Grotesk", monospace;
    font-weight: bold;
    font-size: 16px;
    color: #660026;
  }
  input::placeholder {
    font-family: "Space Grotesk", monospace;
  }
  .send {
    padding: 0.75rem;
    font-size: large;
    border-radius: 10px;
    margin-left: 0.75rem;
    border: none;
    font-family: "Martian Mono", monospace;
    cursor: pointer;
    transition: all;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
  }
  input:focus {
    outline: none;
  }
  @media screen and (max-width: 720px) {
    .wrapper {
      max-width: unset;
      width: 100%;
      margin: 0;
    }

    h2 {
      font-size: 24px;
      margin-left: 3rem;
      color: var(--md-sys-color-primary);
    }
    .box {
      margin-left: 2rem;
    }
    .goback-small {
      display: block;
      font-weight: 500;
      text-align: right;
      margin-bottom: 1rem;
    }
    input {
      border-radius: 0;
      padding: 1rem;
      padding-left: 2.5rem;
    }
    .input {
      display: flex;
      gap: 0rem;
      margin-bottom: 2rem;
    }
    .send {
      border-radius: 0;
      margin: 0;
    }
  }
</style>
