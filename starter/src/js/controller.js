import * as model from './model.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchview.js';
import resultsView from './views/resultsview.js';
import pageView from './views/pageview.js';
import bookmarkView from './views/bookmarkview.js';
import addRecipeView from './views/addrecipeview.js';
import { FORM_SEC } from './config.js';
import 'core-js'; // for every es6 features
import 'regenerator-runtime/runtime'; // for async functions

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // seperate id of each recipe

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Highlighting the selected result for result view
    resultsView.update(model.searchPages());
    bookmarkView.update(model.state.bookmark);

    // 1. Loading recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe on the page

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    resultsView.renderSpinner();
    // Get query
    const query = searchView.getInput();

    if (!query) return;
    // Load the query results
    await model.loadSearches(query);

    // Render results
    resultsView.render(model.searchPages());

    // render page buttons
    pageView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPages = function (goToPage) {
  // Render new results
  resultsView.render(model.searchPages(goToPage));

  // render new page buttons
  pageView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the servings (in state)
  model.changeServings(newServings);

  // Update the ingredients
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // Add/Removing bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.removeBookMark(model.state.recipe.id);
  }

  // Updating recipe view
  recipeView.update(model.state.recipe);

  // Rendering bookmarks
  bookmarkView.render(model.state.bookmark);
};

const bookmarkRender = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // spinner
    addRecipeView.renderSpinner();

    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderSuccess();

    // render bookmarkview
    bookmarkView.render(model.state.bookmark);

    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, FORM_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addBookMarkrender(bookmarkRender);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addServingHandle(controlServings);
  recipeView.addBookMarkhandle(controlBookmark);
  searchView.formHandler(controlSearch);
  pageView.pageClick(controlPages);
  addRecipeView._addUploadhandle(controlAddRecipe);
};

init();
