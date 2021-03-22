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
</header>

<main class="main__content">
</main>

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
