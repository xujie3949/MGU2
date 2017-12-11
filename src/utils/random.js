class Random {
  min = 0;
  max = 1;

  constructor(min, max) {
    this.min = min || this.min;
    this.max = max || this.max;
  }

  setMin(value) {
    this.min = value;
  }

  setMax(value) {
    this.max = value;
  }

  setRange(min, max) {
    this.min = min;
    this.max = max;
  }

  getRandom(min, max) {
    if (min) {
      this.setMin(min);
    }
    if (max) {
      this.setMax(max);
    }
    const random = Math.random();
    const diff = this.max - this.min + 1;
    return Math.floor(random * diff + this.min);
  }
}

const random = new Random();

export default random;
