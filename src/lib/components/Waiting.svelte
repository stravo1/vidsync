<script>
  import { createEventDispatcher } from "svelte";
  import connect from "../../assets/images/14.svg";

  let dispatch = createEventDispatcher();
  export let roomId;

  const hangup = () => {
    var sure = confirm("Abandon room?");
    if (!sure) return;

    dispatch("hangup");
  };
</script>

<div class="wrapper">
  <div class="center">
    <img src={connect} alt=":)" />
  </div>
  <section class="on-surface-variant-text info">
    <h2>waiting...</h2>
    room id:
    <section class="roomId on-surface-text">
      {roomId}
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
  .roomId {
    padding: 0.5rem 0.25rem;
    margin: 0.25rem 0;
    word-break: break-all;
    user-select: all;
    border-radius: 0.25rem;
    border: 2px #cac4d0;
    border-style: dashed;
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
</style>
