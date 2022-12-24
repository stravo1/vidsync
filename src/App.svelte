<script>
  import Dashboard from "./lib/Dashboard.svelte";
  import Player from "./lib/Player.svelte";
import TopPanel from "./lib/TopPanel.svelte";
</script>

  <TopPanel />
  <main class="background">
  <section>
    <Player />
    <Dashboard />
  </section>
</main>

<style>
  main {
    box-sizing: border-box;
    height: 90%;
    padding: 1rem;
  }
  section{
    padding: 1rem 0;
    display: flex;
    height: 100%;
    box-sizing: border-box;
  }
  @media screen and (max-width: 720px) {
    section {
      flex-direction: column;
    }
  }
</style>
