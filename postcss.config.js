import pNested from 'postcss-nested';
import pAutoprefixer from 'autoprefixer';
import pNano from 'cssnano';

export default (ctx) => ({
  map: ctx.options.map,
  plugins: [
    pNested,
    pAutoprefixer,
    pNano({
      preset: 'default',
    }),
  ],

  //TODO: check for the canonical postcss.config.js properties
  generate: {
    header: '',
    from: [
      // Fonts
      'assets/fonts/fonts.css',

      // Defaults
      'src/css/typography.css',
      'src/css/forms.css',

      // Components
      'src/css/c-experience-triggers.css',
      'src/css/c-sbox-controls.css',
      'src/css/c-stream-video.css',

      // Pages
      'src/css/pg-home.css',
      'src/css/pg-chat.css',
      'src/css/pg-freebies.css',
      'src/css/style.css',

      'src/css/layout.css',
      'src/css/theme.css',
    ],
    outdir: '_site/',
    // If no outfile don't concat into single file
    outfile: '_site/style.css',
  }
});
