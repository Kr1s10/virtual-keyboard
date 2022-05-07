import create from './creater.js';
import listOfLang from './layouts/langs.js';
import Key from './Key.js';

export default class Keyboard {
  constructor(rows) {
    this.rows = rows;
    this.keyPressed = {};
    this.isCaps = false;
    this.wrapper = create('div', 'keyboard');
  }

  init(lang) {
    this.keyBase = listOfLang[lang];
    return this;
  }

  show() {
    this.keyBtns = [];
    this.rows.forEach((row, i) => {
      const rowElem = create('div', 'keyboard-row');
      rowElem.dataset.row = i + 1;
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyBtn = new Key(keyObj);
          this.keyBtns.push(keyBtn);
          rowElem.append(keyBtn.wrapper);
        }
      });
      this.wrapper.append(rowElem);
    });
    return this;
  }
}
