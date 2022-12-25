<script>
  import { getTime } from "../assets/js/misc";

  let files;
  let selected;
  let src;
  let player;
  let wrapper;
  let name = "";
  let time = 0;
  let max = 0;
  let timer = null;
  let paused = true;
  let ended = false;
  let muted = false;
  let full = false;
  let visible = true;
  let touch = false;

  $: {
    if (files == undefined) {
      selected = false;
    } else if (files.length) {
      selected = true;
      src = URL.createObjectURL(files[0]);
      name = files[0].name;
      setTimeout(setPlayer, 100);
    }
  }

  $: if (player == undefined) {
    max = 0;
  } else {
    max = player.duration;
  }

  const clickOpen = () => {
    document.getElementById("fileSelector").click();
  };

  const setPlayer = (e) => {
    player = document.getElementById("video");
    wrapper = document.getElementById("player");

    player.addEventListener("loadedmetadata", () => {
      max = player.duration;
    });
    setInterval(() => {
      time = player.currentTime;
      ended = player.ended;
    }, 1000);
  };

  const handlePlay = () => {
    handleOpacity();
    if (ended) {
      player.currentTime = 0;
      player.play();
      return;
    }
    if (player.paused) {
      player.play();
      paused = false;
    } else {
      player.pause();
      paused = true;
    }
  };
  const handleSeek = (e) => {
    handleOpacity();
    player.currentTime = e.target.value;
  };
  const handleForward = () => {
    handleOpacity();
    if (time + 10 > max) {
      player.currentTime = max - 5;
      return;
    }
    player.currentTime = time + 10;
  };
  const handleBackward = () => {
    handleOpacity();
    if (time - 10 < 0) {
      player.currentTime = 5;
      return;
    }
    player.currentTime = time - 10;
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
              {#if paused}
                play_arrow
              {:else if ended}
                restart_alt
              {:else}
                pause
              {/if}
            </span>
          </div>
          <div
            on:click|stopPropagation={handleForward}
            on:keypress={handleForward}
          >
            <span class="button unselectable material-symbols-rounded"
              >fast_forward</span
            >
          </div>
        </div>
        <div class="timeline">
          <div class="lower-controls">
            <div
              on:click|stopPropagation={handleVolume}
              on:keypress={handleVolume}
            >
              <span class="lower-button unselectable material-symbols-rounded"
                >{#if !muted}
                  volume_up
                {:else}
                  volume_mute
                {/if}
              </span>
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
          <div class="seek">
            <div class="label-small unselectable">{getTime(time)}</div>

            <input
              id="seek"
              class="unselectable"
              value={time}
              type="range"
              {max}
              on:change|stopPropagation={handleSeek}
            />

            <div class="label-small unselectable">
              {getTime(max)}
            </div>
          </div>
        </div>
      </div>
      <video {src} type="video/mp4" id="video">
        <track kind="captions" />
      </video>
    </div>
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
    font-size: 18px;
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
