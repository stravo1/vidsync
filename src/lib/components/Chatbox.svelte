<script>
  import ChatBubble from "./ChatBubble.svelte";

</script>
<section class="wrapper">
  <section class="top on-surface-variant-text">
    <h3>messages</h3>
    <div>
      <span class="material-symbols-rounded"> logout </span>
    </div>
  </section>
  <div class="box">
    <ChatBubble help={true} />
    <ChatBubble name={"stravo1"} message={"Sit dolor lapen mot gegur"} received={true} />
    <ChatBubble name={"stravo1"} message={":disconnect"} received={true} />
  </div>
  <div class="input">
    <input type="text" class="on-surface-variant" placeholder="enter message" />
    <button class="send center error on-error-text">
      <span class="material-symbols-rounded"> send </span>
    </button>
  </div>
</section>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 420px;
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
  .box {
    flex-basis: 95%;
    box-sizing: border-box;
    overflow: scroll;
    border: 2px white;
    border-style: none;
    border-radius: 0.5rem;
    margin: 1rem 0;
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
