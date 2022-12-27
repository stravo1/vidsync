<script>
  export let message = "Lorem Ipsum";
  export let name = "@system";
  export let received = false;
  export let help = false;
</script>

<div class="wrapper">
  <div class:help class:received>
    <span class="name">
      {name}
    </span>
    <br />
    <span class="message">{message}</span>
  </div>
</div>

<style>
  .wrapper {
    width: 90%;
    box-sizing: border-box;
    margin: 1rem 0.25rem;
    overflow-x: scroll;
    border-radius: 0.25rem;
  }
  .wrapper > div {
    background-color: #e5bdc2;
    color: #660026;
    padding: 0.5rem;
    width: fit-content;
    opacity: 0.9;
  }
  .received {
    background-color: #ebbf90 !important;
    color: #452b08 !important;
  }
  .help {
    background-color: #ffdad6 !important;
    color: #93000a !important;
  }
  .name {
    font-size: 12px;
    opacity: 0.7;
  }
  .message {
    font-size: 14px;
  }
</style>
