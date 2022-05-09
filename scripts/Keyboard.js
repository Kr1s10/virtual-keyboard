/* eslint-disable no-param-reassign */
import create from './creater.js';
import listOfLang from './layouts/langs.js';
import Textarea from './Textarea.js';
import Key from './Key.js';

export default class Keyboard {
  constructor(rows) {
    this.rows = rows;
    this.keyPressed = {};
    this.isCaps = false;
    this.wrapper = create('div', 'keyboard');
    this.textarea = new Textarea(5, 50).wrapper;
  }

  init(lang) {
    this.keyBase = listOfLang[lang];
    this.wrapper.dataset.lang = lang;
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

    document.addEventListener('keydown', this.keyEventHandler);
    document.addEventListener('keyup', this.keyEventHandler);

    return this;
  }

  keyEventHandler = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    e.preventDefault();
    const { code, type } = e;
    const keyObj = this.keyBtns.find((key) => key.code === code);
    if (!keyObj) return;

    if (type.includes('down')) {
      keyObj.wrapper.classList.add('active');
      this.textarea.focus();

      if (code.includes('Shift')) this.isShift = true;
      if (code.includes('Control')) this.isCtrl = true;
      if (code.includes('Alt')) this.isAlt = true;

      if (code.includes('Control') && this.isAlt) this.switchLang();
      if (code.includes('Alt') && this.isCtrl) this.switchLang();
    } else {
      keyObj.wrapper.classList.remove('active');
      if (code.includes('Shift')) this.isShift = false;
      if (code.includes('Alt')) this.isAlt = false;
      if (code.includes('Control')) this.isCtrl = false;
    }
  };

  switchLang = () => {
    const langArr = Object.keys(listOfLang);
    let langIndex = langArr.indexOf(this.wrapper.dataset.lang);
    this.keyBase = langIndex + 1 < langArr.length
      ? listOfLang[langArr[langIndex += 1]]
      : listOfLang[langArr[langIndex -= langIndex]];

    this.wrapper.dataset.lang = langArr[langIndex];

    this.keyBtns.forEach((btn) => {
      const keyObj = this.keyBase.find((key) => key.code === btn.code);
      if (!keyObj) return;

      btn.shiftKey = keyObj.shiftKey;
      btn.key = keyObj.key;

      if (btn.shiftKey && btn.key.toUpperCase() !== btn.shiftKey) {
        btn.sub.innerHTML = keyObj.shiftKey;
      } else btn.sub.innerHTML = '';

      btn.letter.innerHTML = keyObj.key;
    });
  };
}
