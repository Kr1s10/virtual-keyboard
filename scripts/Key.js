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

    if (shiftKey && key.toUpperCase() !== shiftKey) this.sub.innerHTML = this.shiftKey;

    this.wrapper = create('div', 'key');
    this.wrapper.dataset.code = this.code;
    this.wrapper.append(this.sub, this.letter);
  }
}
