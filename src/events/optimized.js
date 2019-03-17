const throttle = function(type, name, options, reference) {
  reference = reference || window;
  let running = false;
  const func = function() {
    if (running) { return; }
    running = true;
    requestAnimationFrame(() => {
      reference.dispatchEvent(new CustomEvent(name));
      running = false;
    });
  };
  reference.addEventListener(type, func, options);
}

throttle('resize', 'optimizedResize', {
  passive: true
});

throttle('scroll', 'optimizedScroll', {
  passive: true
});
