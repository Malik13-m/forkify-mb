import ViewParent from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewview.js';

class ResultView extends ViewParent {
  _parentElement = document.querySelector('.results');
  _error = 'No recipes found!';
  _success = ``;

  _generateHTML() {
    return this._data.map(res => previewView.render(res, false)).join('');
  }
}

export default new ResultView();
