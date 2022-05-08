import create from './creater.js';

export default class Key {
  constructor({ key, shiftKey, code }) {
    this.key = key;
    this.shiftKey = shiftKey;
    this.code = code;
    this.isFuncKey = !shiftKey;
    this.sub = create('div', 'sub');
    this.letter = create('div', 'letter');
    this.letter.innerHTML = this.key;
    this.wrapper = create('div', 'key');

    if (shiftKey && key.toUpperCase() !== shiftKey) this.sub.innerHTML = this.shiftKey;
    if (this.isFuncKey) {
      if (!this.code.includes('Arrow')) this.wrapper.classList.add('func', `${this.code}`);
      else this.wrapper.classList.add('func', 'arrow');
    }

    this.wrapper.dataset.code = this.code;
    this.wrapper.append(this.sub, this.letter);
  }
}
