import icons from 'url:../../img/icons.svg';
// ../.. means moving to the parent folder which is src in this case.
import Fraction from 'fracty';
import ViewParent from './view.js';

class RecipeView extends ViewParent {
  _parentElement = document.querySelector('.recipe');
  _error = 'The recipe of the search item does not exist!';
  _success = ``;

  addHandlerRender(handleFunc) {
    const listenEvents = ['hashchange', 'load'];
    listenEvents.forEach(ev => window.addEventListener(ev, handleFunc));
  }

  addServingHandle(handleFunc) {
    this._parentElement.addEventListener('click', function (e) {
      const btnServing = e.target.closest('.btn--update-servings');
      if (!btnServing) return;

      const updateTo = +btnServing.dataset.updateTo;
      if (updateTo > 0) handleFunc(updateTo);
    });
  }

  addBookMarkhandle(handleFunc) {
    this._parentElement.addEventListener('click', function (e) {
      const btnBookMark = e.target.closest('.btn--bookmark');

      if (!btnBookMark) return;

      handleFunc();
    });
  }

  _generateHTMLingredient(ing) {
    return `<li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="src/img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${ing.quantity}</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
        </div>
      </li>`;
  }
}

export default new RecipeView();
