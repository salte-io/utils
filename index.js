import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';

console.log('[Utils]: Checking for the magic! ✨');

// NOTE: Requiring CSS Grid means that we don't support Edge <= 15.
if (window.HTMLTemplateElement && CSS.supports('display', 'grid')) {
  console.log('[Utils]: Magic found! Launching the rockets! 🚀');

  import('./src/utils-app.js').then(() => {
    console.log('[Utils]: Rockets have reached orbit! 🌕');
  }).catch((error) => {
    console.log('[Utils]: Failed to reach orbit! 🔥', error);
  });
} else {
  console.log('[Utils]: Launch has been aborted due to an unsupported browser!');
  document.body.classList.add('invalid-browser');
}
