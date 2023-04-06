<div class="info on-primary-text">
  a <span class="big">synchronized</span><span class="small">synced</span> video
  player for you and your partner!
  <div class="subtitle">- you're welcome</div>
</div>

<style>
  .info {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    font-size: 60px;
    font-weight: 500;
    max-width: 50vw;
    margin-left: 3rem;
    margin-bottom: 1rem;
  }
  .subtitle {
    font-size: 40px;
    font-weight: 400;
    margin-top: 2rem;
  }
  .small {
    display: none;
  }
  @media screen and (max-width: 720px) {
    .info {
      position: relative;
      font-size: 46px;
      height: 90%;
    }
    .small {
      display: inline;
    }
    .big {
      display: none;
    }
    .subtitle {
      display: none;
    }
  }
</style>
