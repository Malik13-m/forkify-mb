import ViewParent from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecView extends ViewParent {
  _parentElement = document.querySelector('.upload');
  _success = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  // to run the function as soon as the page loads
  constructor() {
    super();
    this._addWindowShowhandle();
    this._addWindowClosehandle();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addWindowShowhandle() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addWindowClosehandle() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addUploadhandle(handlerFunc) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handlerFunc(data);
    });
  }

  _generateHTML() {}
}

export default new AddRecView();
