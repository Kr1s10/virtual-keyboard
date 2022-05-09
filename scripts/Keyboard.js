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
    this.textarea.focus();

    if (type.includes('down')) {
      keyObj.wrapper.classList.add('active');

      if (code.includes('Caps') && this.isCaps) {
        this.isCaps = false;
        this.setUpperCase(false);
        keyObj.wrapper.classList.remove('active');
      } else if (code.includes('Caps')) {
        this.isCaps = true;
        this.setUpperCase(true);
      }

      if (code.includes('Shift')) {
        this.isShift = true;
        this.setUpperCase(true);
      }

      if (code.includes('Control')) this.isCtrl = true;
      if (code.includes('Alt')) this.isAlt = true;

      if (code.includes('Control') && this.isAlt) this.switchLang();
      if (code.includes('Alt') && this.isCtrl) this.switchLang();

      if (!this.isCaps) {
        this.print(keyObj, this.isShift ? keyObj.shiftKey : keyObj.key);
      } else if (this.isCaps) {
        if (this.isShift) {
          this.print(keyObj, keyObj.sub.innerHTML ? keyObj.shiftKey : keyObj.key);
        } else {
          this.print(keyObj, !keyObj.sub.innerHTML ? keyObj.shiftKey : keyObj.key);
        }
      }
    } else {
      if (!code.includes('Caps')) keyObj.wrapper.classList.remove('active');

      if (code.includes('Shift')) {
        this.isShift = false;
        this.setUpperCase(false);
      }

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

  setUpperCase(flag) {
    if (flag) {
      this.keyBtns.forEach((btn) => {
        if (this.isCaps && this.isShift) {
          if (btn.sub.innerHTML) {
            btn.sub.innerHTML = btn.key;
            btn.letter.innerHTML = btn.shiftKey;
          } else {
            btn.letter.innerHTML = btn.key;
          }
        } else if (this.isShift) {
          if (btn.sub.innerHTML) {
            btn.sub.innerHTML = btn.key;
          }
          if (!btn.isFuncKey) {
            btn.letter.innerHTML = btn.shiftKey;
          }
        } else if (this.isCaps) {
          if (!btn.sub.innerHTML && !btn.isFuncKey) {
            btn.letter.innerHTML = btn.shiftKey;
          }
        }
      });
    } else {
      this.keyBtns.forEach((btn) => {
        if (btn.sub.innerHTML) {
          btn.sub.innerHTML = btn.shiftKey;
          btn.letter.innerHTML = btn.key;
        } else if (!btn.sub.innerHTML && !btn.isFuncKey && this.isCaps) {
          btn.letter.innerHTML = btn.shiftKey;
        } else btn.letter.innerHTML = btn.key;
      });
    }
  }

  print(keyObj, key) {
    let cursorPos = this.textarea.selectionStart;
    const left = this.textarea.value.slice(0, cursorPos);
    const right = this.textarea.value.slice(cursorPos);

    const methodsOfFuncBtns = {
      Tab: () => {
        this.textarea.value = `${left}\t${right}`;
        cursorPos += 1;
      },
      Enter: () => {
        this.textarea.value = `${left}\n${right}`;
        cursorPos += 1;
      },
      Space: () => {
        this.textarea.value = `${left} ${right}`;
        cursorPos += 1;
      },
      Backspace: () => {
        this.textarea.value = `${left.slice(0, -1)}${right}`;
        cursorPos -= 1;
      },
      Delete: () => {
        this.textarea.value = `${left}${right.slice(1)}`;
      },
    };

    if (methodsOfFuncBtns[keyObj.code]) methodsOfFuncBtns[keyObj.code]();
    if (!keyObj.isFuncKey || keyObj.code.includes('Arrow')) {
      cursorPos += 1;
      this.textarea.value = `${left}${key}${right}`;
    }

    this.textarea.setSelectionRange(cursorPos, cursorPos);
  }
}
