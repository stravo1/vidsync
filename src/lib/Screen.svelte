<script>
  import Player from "./components/Player.svelte";

  let files;
  let selected;
  let src;
  let name = "";

  $: {
    if (files == undefined) {
      selected = false;
    } else if (files.length) {
      selected = true;
      src = URL.createObjectURL(files[0]);
      name = files[0].name;
    }
  }

  const clickOpen = () => {
    document.getElementById("fileSelector").click();
  };
</script>

<div class="wrapper">
  {#if !selected}
    <div
      class="selector on-background-text"
      on:click={clickOpen}
      on:keypress={clickOpen}
    >
      <div>
        <input type="file" accept="video/*" bind:files id="fileSelector" />
        <span class="material-symbols-rounded"> add </span>
        <br />
        select a video file
      </div>
    </div>
  {:else}
    <Player {src} {name} />
  {/if}
</div>

<style>
  #fileSelector {
    display: none;
  }
  .wrapper {
    width: 75%;
    box-sizing: border-box;
    text-align: center;
    margin: 0 1rem;
    height: 100%;
  }
  .selector {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;
    border-width: 3px;
    border-color: #ece0e0;
    border-style: dashed;
    border-radius: 1rem;
  }
  .selector:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 720px) {
    .wrapper {
      width: 100%;
      box-sizing: border-box;
      margin: 1rem 0;
    }
  }
</style>
