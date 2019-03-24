export function RandomMixin(superClass) {
  return class extends superClass {
    pseudoRandomItem(array, previousItems) {
      const random = Math.floor(Math.random() * array.length);

      if (previousItems.includes(array[random])) {
        return this.pseudoRandomItem(array, previousItems);
      }

      return array[random];
    }
  }
}
