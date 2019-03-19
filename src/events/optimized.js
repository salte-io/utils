const throttle = function(type, name, options, reference) {
  reference = reference || window;
  let running = false;

  reference.addEventListener(type, () => {
    if (running) { return; }
    running = true;
    requestAnimationFrame(() => {
      reference.dispatchEvent(new CustomEvent(name));
      running = false;
    });
  }, options);
}

throttle('resize', 'optimizedResize', {
  passive: true
});

throttle('scroll', 'optimizedScroll', {
  passive: true
});

export { throttle };
