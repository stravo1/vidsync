<script>
  import { createEventDispatcher } from "svelte";
  import kitty from "../../assets/5.png";

  const dispatch = createEventDispatcher();
  const create = () => {
    dispatch("create");
  };
  const join = () => {
    dispatch("join");
  };
</script>

<div class="wrapper">
  <div class="center">
    <img src={kitty} alt=":)" />
  </div>
  <section class="on-surface-variant-text info">
    <h2>welcome!</h2>
    join a room to continue
  </section>
  <input class="roomId" type="text" placeholder="Enter room id" />
  <button class="secondary on-secondary-text join" on:click={join}>Join</button>
  <div class="divider on-surface-variant-text">or</div>
  <button class="secondary on-secondary-text create" on:click={create}
    >Create room</button
  >
</div>

<style>
  .wrapper {
    width: 100%;
    height: fit-content;
    box-sizing: border-box;
    margin: 2rem 0 1rem 0;
  }
  img {
    width: 90%;
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
    margin: 1.5rem 0 1rem 0;
  }
  .roomId::placeholder {
    font-family: "Martian Mono", monospace;
  }
  button {
    padding: 0.5rem;
    font-size: large;
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
  .join,
  .create {
    width: 100%;
  }
  .create {
    padding: 0.75rem;
  }
</style>
