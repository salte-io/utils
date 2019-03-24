import TypeIt from 'typeit';

export function TypeMixin(superClass) {
  return class extends superClass {
    type({ element, text }) {
      return new Promise((resolve) => {
        new TypeIt(element, { afterComplete: resolve })
          .options({ speed: 50 })
          .type(text)
          .go();
      });
    }

    wait(timeout) {
      return new Promise((resolve) => setTimeout(resolve, timeout));
    }
  };
}

