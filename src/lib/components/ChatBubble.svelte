<script>
  export let message = "Lorem Ipsum";
  export let name = "@system";
  export let received = false;
  export let help = false;
</script>

<div class="wrapper">
  <div class="primary on-primary-text" class:help class:received>
    <span class="name">
      {name}
    </span>
    <span class="message">{message}</span>
  </div>
</div>

<style>
  .wrapper {
    width: 90%;
    box-sizing: border-box;
    margin: 1.5rem 0.25rem;
    overflow-x: scroll;
    border-radius: 0.25rem;
  }
  .wrapper > div {
    /* background-color: #BC004C;
    color: #ffecf3; */
    font-weight: bold;
    padding: 0.5rem;
    width: fit-content;
    border-radius: 0.25rem;
    opacity: 0.9;
    min-width: 50px;
  }
  .received {
    background-color: #FF4E7D !important;
    color: #661f32 !important;
  }
  /* .received > .name {
    color: #492231;
  }
  .help {
    background-color: #ECE0E0 !important;
    color: #816d6d !important;
  }
  .help > .name {
    color: rgb(68, 68, 68);
  } */
  span {
    display: block;
  }
  .name {
    font-size: 12px;
    font-weight: 500;
  }
  .message {
    font-size: 16px;
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
</style>
