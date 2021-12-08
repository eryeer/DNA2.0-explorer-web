export default class Loading {
  constructor() {
    this.count = 0;
  }
  get value() {
    return this.count !== 0;
  }

  increase() {
    this.count += 1;
  }

  decrease() {
    this.count -= 1;
  }

  async run(asyncTask) {
    try {
      this.increase();
      return await asyncTask();
    } finally {
      this.decrease();
    }
  }
}
