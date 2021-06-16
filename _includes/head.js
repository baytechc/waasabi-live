import { html } from '@popeindustries/lit-html-server/index.mjs';

import {
  TITLE,
  DESCRIPTION,
  TWITTER,
  SOCIALIMAGE_LINK,
  SOCIALIMAGE_ALT,
  PAYMENTPTR
} from '../src/js/config.js';

export default html`
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${TITLE}</title>
<meta name="description" content="${DESCRIPTION}">

<meta name="twitter:site" content="${TWITTER}">
<meta name="twitter:title" content="${TITLE}">
<meta name="twitter:description" content="${DESCRIPTION}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SOCIALIMAGE_LINK}">
<meta name="twitter:image:alt" content="${SOCIALIMAGE_ALT}">

<link rel="stylesheet" href="/style.css">

<meta name="monetization" content="${PAYMENTPTR}">
</head>
`;
