import ViewParent from './view.js';
import icons from 'url:../../img/icons.svg';

class PageView extends ViewParent {
  _parentElement = document.querySelector('.pagination');

  pageClick(handlerFunc) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goto = +btn.dataset.goto;
      handlerFunc(goto);
    });
  }

  _nextPage() {
    return `  <button data-goto="${
      this._data.page + 1
    }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }

  _prevPage() {
    return `<button data-goto="${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>`;
  }

  _generateHTML() {
    const noOfpages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // At page 1 and there are other pages
    if (this._data.page === 1 && noOfpages > 1) {
      return this._nextPage();
    }

    // At Last page
    if (this._data.page === noOfpages && noOfpages > 1) {
      return this._prevPage();
    }

    // At other page
    if (this._data.page < noOfpages) {
      return this._prevPage().concat(this._nextPage());
    }

    // At page 1 and there are no other pages (/ no buttons)
    return '';
  }
}

export default new PageView();
