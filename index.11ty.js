import HEAD from './_includes/head.js';

// TODO: alternatively, https://github.com/motss/lit-ntml
import { html, renderToBuffer } from '@popeindustries/lit-html-server/index.mjs';

const main = (eleventy, data) => html`
<!doctype html>
<html lang="en">

${HEAD}

<body>

<header>
  <a href="https://waasabi.org" target="_blank"><img src="/assets/logo.png"></a>
  <nav>
    <!--
    <a href="">Schedule</a>
    <button class="home-button" data-action="go-home"
      title="Display the opening page on the sidebar"><svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Home icon</title>
      <path d="M7.1 18.8v-3c0-.9.7-1.5 1.5-1.5h2.8a1.4 1.4 0 011.5 1.4v3A1.2 1.2 0 0014 20h2a3.5 3.5 0 003.4-3.4V7.9c0-.8-.3-1.5-.9-2L11.9.8c-1.1-1-2.8-1-4 0L1.6 6c-.6.4-1 1.1-1 1.9v8.7C.5 18.5 2 20 4 20h1.9c.7 0 1.2-.5 1.2-1.2z" fill="#fff"/>
    </svg></button>
    -->
</header>

<div class="streambox__player">
  <video id="stream" class="streambox__video" poster="/assets/video-holder.jpg"></video>
  <!--<div class="streambox__player__overlay">
    <button class="streambox__player__playbutton">
      <img src="/assets/playback.svg" alt="Play" />
    </button>
  </div>-->
</div>

<aside class="streambox__sidebar"></aside>

<footer>
  <div>
    <p>Make sure you are familiar with our
      <a href="https://waasabi.org/code-of-conduct" target="_blank">Code of Conduct.</a>
  </div>
</footer>

<script src="/website.js"></script>
</body>
</html>
`;

export default function index(data) {
  return renderToBuffer(main(this, data));
}
