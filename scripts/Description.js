import create from './creater.js';

export default class Description {
  constructor() {
    this.title = create('h1', 'title');
    this.description = create('p', 'description');
    this.hint = create('p', 'hint');
    this.title.innerHTML = 'Virtual Keyboard';
    this.description.innerHTML = 'This keyboard was created in Windows.';
    this.hint.innerHTML = 'The keyboard shortcut for changing language - left <span>Ctrl</span> + <span>Alt</span>';
  }
}
