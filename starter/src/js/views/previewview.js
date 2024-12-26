import ViewParent from './view.js';
import icons from 'url:../../img/icons.svg';

class PreviewView extends ViewParent {
  _generateHTMLPreview() {
    const id = window.location.hash.slice(1).trim();

    return ` <li class="preview">
                <a class="preview__link ${
                  this._data.id.trim() === id ? 'preview__link--active' : ''
                }" href="#${this._data.id}">
                  <figure class="preview__fig">
                    <img src="${this._data.imageUrl}" alt="${
      this._data.title
    }" />
                  </figure>
                  <div class="preview__data">
                    <h4 class="preview__title">${this._data.title}</h4>
                    <p class="preview__publisher">${this._data.publisher}</p>
                  
                  <div class="preview__user-generated ${
                    this._data.key ? '' : 'hidden'
                  }">
                <svg>
                    <use href="${icons}#icon-user"></use>
                          </svg>
                        </div>
                      </div>
                </a>
              </li>`;
  }

  render(data, render = true) {
    this._data = data;
    if (!render) return this._generateHTMLPreview(); // return the HTML string when render = false
    super.render(data, render); // if render is true, update the DOM
  }
}

export default new PreviewView();
