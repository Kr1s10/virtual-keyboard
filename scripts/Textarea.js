import create from './creater.js';

export default class Textarea {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.wrapper = create(
      'textarea',
      'area',
      ['placeholder', 'Type something...'],
      ['rows', row],
      ['cols', col],
      ['spellcheck', false],
      ['autocorrect', 'off'],
    );
  }
}
