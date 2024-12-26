import { async } from 'regenerator-runtime';
import { API_URL, API_KEY } from './config';
// import { getJSON, sendJSON } from './helper';
import { AJAXfunc } from './helper';
import { RESULT_PER_PAGE } from './config';

/* to document functions is jsDocs use /** */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmark: [],
};

const createRec = function (data) {
  // renaming the data properties
  const recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // 1. Loading Recipe from API
    const data = await AJAXfunc(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRec(data);

    if (state.bookmark.some(bk => bk.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Search Implementation
export const loadSearches = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAXfunc(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch {
    console.error(err);
    throw err;
  }
};

export const searchPages = function (pages = state.search.page) {
  state.search.page = pages;

  const start = (pages - 1) * state.search.resultsPerPage;
  const end = pages * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const changeServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};

export const addBookMark = function (recipe) {
  // add bookmark
  state.bookmark.push(recipe);

  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookMark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);

  // mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// taking data out of localstorage

const init = function () {
  const storage = localStorage.getItem('bookmark');

  if (storage) state.bookmark = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmark');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('Please input ingredients in correct format!');

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit: unit ? unit : '',
          description: description ? description : '',
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAXfunc(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRec(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
