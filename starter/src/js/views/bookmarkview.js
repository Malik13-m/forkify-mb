import ViewParent from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewview.js';

class BookMarkView extends ViewParent {
  _parentElement = document.querySelector('.bookmarks__list');
  _error = 'No BookMarks yet!';
  _success = ``;

  addBookMarkrender(handleFunc) {
    window.addEventListener('load', handleFunc);
  }

  _generateHTML() {
    return this._data.map(bm => previewView.render(bm, false)).join('');
  }
}

export default new BookMarkView();
