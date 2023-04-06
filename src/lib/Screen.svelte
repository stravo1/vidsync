<script>
  import { dataChannel, files, name, connected } from "../assets/js/store";
  import Info from "./components/Info.svelte";
  import Player from "./components/Player.svelte";
  import Controls from "./components/Controls.svelte";
  import TopPanel from "./TopPanel.svelte";

  let src;

  $: {
    if ($files == null) {
      name.set("");
    } else if ($files.length) {
      src = URL.createObjectURL($files[0]);
      name.set($files[0].name);
      $dataChannel.send(":set-video " + $name);
    }
  }

  const clickOpen = () => {
    if ($dataChannel == undefined) {
      alert("Please join a room first!");
      return;
    }
    document.getElementById("fileSelector").click();
  };
  const scroll = () => {
    var main = document.getElementsByTagName("main")[0];
    main.scrollTop = main.scrollHeight;
  };
</script>

<div class="screen primary">
  <TopPanel />
  <div class={$connected ? "wrapper center" : "wrapper"}>
    {#if $connected}
      {#if $name == ""}
        <div
          class="selector on-primary-text"
          on:click={clickOpen}
          on:keypress={clickOpen}
        >
          <div class="text">
            <input
              type="file"
              accept="video/*"
              bind:files={$files}
              id="fileSelector"
            />
            <div style="text-align: center">
              <span class="material-symbols-rounded no-fill">
                upload_file
              </span>
            </div>
            select a video file
          </div>
        </div>
      {:else}
        <Player {src} />
      {/if}
      <Controls on:hangup on:mute on:unmute />
    {:else}
      <Info />
      <div
        on:click={scroll}
        on:keypress={scroll}
        class="scroll on-primary-text"
      >
        ↓
      </div>
    {/if}
  </div>
</div>

<style>
  #fileSelector {
    display: none;
  }
  .screen {
    width: 100%;
    height: 100%;
  }
  .wrapper {
    width: 100%;
    box-sizing: border-box;
    height: 90%;
    position: relative;
    flex-direction: column;
  }
  .selector {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;
    border-radius: 1rem;
    font-size: 36px;
    font-weight: bold;
  }
  .selector:hover {
    cursor: pointer;
  }
  .text:hover {
    text-decoration: underline;
    text-decoration-thickness: 0.25rem;
  }
  .no-fill {
    font-size: 48px;
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  }
  .scroll {
    display: none;
  }
  @media screen and (max-width: 720px) {
    .screen {
      height: 100vh;
    }
    .scroll {
      display: block;
      position: absolute;
      bottom: 3%;
      right: 50%;
      font-size: 40px;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .scroll:hover {
      cursor: pointer;
    }
  }
</style>
