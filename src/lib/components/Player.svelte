<script>
  import { default as toWebVTT } from "srt-webvtt";
  import { onMount } from "svelte";
  import { getTime } from "../../assets/js/misc";
  import {
    dataChannel,
    ended,
    max,
    paused,
    subsName,
    time,
  } from "../../assets/js/store";
  export let src = "";
  export let name = "";

  let player;
  let wrapper;
  let subsFile;
  let subs;
  let timer = null;
  let muted = false;
  let full = false;
  let visible = true;
  let touch = false;

  onMount(() => {
    setTimeout(setPlayer, 100);
  });

  $: if (subsFile != undefined) {
    setSubs();
  }
  const setSubs = async () => {
    let url;
    if (subsFile[0].type == "text/vtt") {
      url = URL.createObjectURL(subsFile[0]);
    } else if (subsFile[0].type == "application/x-subrip") {
      url = await toWebVTT(subsFile[0]);
    } else {
      alert("Unsupported file type :(");
      return;
    }
    subs.src = url;
    player.textTracks[1].mode = "showing";
    subsName.set(subsFile[0].name);
  };
  const setPlayer = (e) => {
    player = document.getElementById("video");
    subs = document.getElementById("subs");
    wrapper = document.getElementById("player");
  };
  const handlePlay = () => {
    handleOpacity();
    if ($ended) {
      time.set(0);
      player.play();
      return;
    }
    if (player.paused) {
      player.play();
      $dataChannel.send(":play");
      paused.set(false);
    } else {
      player.pause();
      $dataChannel.send(":pause");
      paused.set(true);
    }
  };
  const handleSeek = (e) => {
    handleOpacity();
    time.set(e.target.value);
    setTimeout(() => {
      time.set(e.target.value);
    }, 100);
    setTimeout(() => {
      time.set(e.target.value);
    }, 150);
    setTimeout(() => {
      time.set(e.target.value);
    }, 200);
    setTimeout(() => {
      time.set(e.target.value);
    }, 250);
    setTimeout(() => {
      console.log(getTime($time));
      $dataChannel.send(`:seek ${$time}`);
    }, 250);
  };
  const handleForward = () => {
    handleOpacity();
    if ($time + 10 > $max) {
      time.set($max - 5);
      return;
    }
    time.update((time) => time + 10);
    $dataChannel.send(`:seek ${$time}`);
  };
  const handleBackward = () => {
    handleOpacity();
    if ($time - 10 < 0) {
      time.set(3);
      return;
    }
    time.update((time) => time - 10);
    $dataChannel.send(`:seek ${$time}`);
  };
  const handleVolume = () => {
    handleOpacity();
    if (muted) {
      player.volume = 1;
    } else {
      player.volume = 0;
    }
    muted = !muted;
  };
  const handleSubs = () => {
    document.getElementById("subsFile").click();
  };
  const handleFullScreen = () => {
    handleOpacity();
    var requestFullScreen =
      wrapper.requestFullScreen ||
      wrapper.mozRequestFullScreen ||
      wrapper.webkitRequestFullScreen;
    if (requestFullScreen) {
      requestFullScreen.bind(wrapper)();
      full = true;
    }
    if (full) {
      document.exitFullscreen();
      full = false;
    }
  };
  const resetTimer = () => {
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      visible = false;
      timer = null;
    }, 2500);
  };
  const handleOpacity = (val = null) => {
    if (val == null) {
      // to handle button clicks (invisible button click => visible controls)
      visible = true;
      resetTimer();
      return;
    }
    if (val.type == "touchend" && !touch) {
      // register a touch device
      touch = true;
    }
    if (val.type == "mouseleave") {
      visible = false;
    } else if (val.type == "click" || touch) {
      visible = !visible;
      if (visible) {
        resetTimer();
      }
    } else {
      visible = true;
      resetTimer();
    }
  };
</script>

<input
  id="subsFile"
  type="file"
  accept=".srt,.vtt"
  style="display: none"
  bind:files={subsFile}
/>
<div
  class="player center"
  id="player"
  on:mouseenter={handleOpacity}
  on:mouseleave={handleOpacity}
  on:mousemove={handleOpacity}
  on:click={handleOpacity}
  on:keydown={handleOpacity}
  on:touchend={handleOpacity}
>
  <div class="controls" style={visible ? "opacity: 0.9" : "opacity: 0"}>
    <div class="title">
      <div class="ellipsis unselectable">{name}</div>
    </div>
    <div class="buttons">
      <div
        on:click|stopPropagation={handleBackward}
        on:keypress={handleBackward}
      >
        <span class="button unselectable material-symbols-rounded"
          >fast_rewind</span
        >
      </div>
      <div on:click|stopPropagation={handlePlay} on:keypress={handlePlay}>
        <span class="button unselectable material-symbols-rounded">
          {#if $paused && !$ended}
            play_arrow
          {:else if $ended}
            restart_alt
          {:else}
            pause
          {/if}
        </span>
      </div>
      <div on:click|stopPropagation={handleForward} on:keypress={handleForward}>
        <span class="button unselectable material-symbols-rounded"
          >fast_forward</span
        >
      </div>
    </div>
    <div class="timeline">
      <div class="lower-controls">
        <div on:click|stopPropagation={handleVolume} on:keypress={handleVolume}>
          <span class="lower-button unselectable material-symbols-rounded"
            >{#if !muted}
              volume_up
            {:else}
              volume_mute
            {/if}
          </span>
        </div>
        <div style="display: flex; gap: 1rem">
          <div on:click|stopPropagation={handleSubs} on:keypress={handleSubs}>
            <span class="lower-button unselectable material-symbols-rounded"
              >closed_caption</span
            >
          </div>
          <div
            on:click|stopPropagation={handleFullScreen}
            on:keypress={handleFullScreen}
          >
            <span class="lower-button unselectable material-symbols-rounded"
              >fullscreen</span
            >
          </div>
        </div>
      </div>
      <div class="seek">
        <div class="label-small unselectable">{getTime($time)}</div>

        <input
          id="seek"
          class="unselectable"
          value={$time}
          type="range"
          max={$max}
          on:change|stopPropagation={handleSeek}
        />

        <div class="label-small unselectable">
          {getTime($max)}
        </div>
      </div>
    </div>
  </div>
  <video
    {src}
    id="video"
    bind:currentTime={$time}
    bind:duration={$max}
    bind:paused={$paused}
    bind:ended={$ended}
  >
    <track kind="captions" />
    <track kind="subtitles" id="subs" />
  </video>
</div>

<style>
  .player {
    display: flex;
    position: relative;
    height: 100%;
    background-color: rgb(16, 8, 8);
    border-radius: 1rem;
  }
  .controls {
    position: absolute;
    color: #ece0e0;
    background-color: rgb(22, 14, 14);
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    transition: all;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;
    z-index: 10;
  }
  .title {
    display: flex;
    align-items: center;
    flex-basis: 10%;
    text-align: left;
    padding: 0 1rem;
    width: 75%;
    opacity: 0.75;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    width: 100%;
    box-sizing: border-box;
    flex-basis: 80%;
  }
  .button {
    font-size: 48px;
    opacity: 0.65;
    cursor: pointer;
    transition: all;
    transition-timing-function: ease-in-out;
    transition-duration: 200ms;
  }
  .button:hover {
    opacity: 1;
  }
  .timeline {
    display: flex;
    flex-direction: column;
    flex-basis: 10%;
  }
  .lower-controls {
    display: flex;
    justify-content: space-between;
    padding: 0 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  .lower-button {
    font-size: 20px;
    opacity: 0.65;
    cursor: pointer;
    transition: all;
    transition-timing-function: ease-in-out;
    transition-duration: 200ms;
  }
  .lower-button:hover {
    opacity: 1;
  }
  .seek {
    display: flex;
    position: relative;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    box-sizing: border-box;
    opacity: 0.65;
    gap: 1rem;
    transition: all;
    transition-timing-function: ease-in-out;
    transition-duration: 200ms;
  }
  .seek:hover {
    opacity: 1;
  }
  video {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
  }
  video::cue {
    background-color: #00000051;
  }
  video::-webkit-media-text-track-container {
    overflow: visible !important;
    -webkit-transform: translateY(-5%) !important;
    transform: translateY(-5%) !important;
    position: relative;
  }
</style>
