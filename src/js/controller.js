import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import bookmarksView from './Views/bookmarksView.js';
import paginationView from './Views/paginationView.js';
import addRecipeView from './Views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';
// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0. Update result view to mark selected search result
    resultsView.update(model.getSearchResultPage());
    //3.Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //1. Loading recipe
    await model.loadRecipe(id);

    //2.rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
//controlRecipes();
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1. Get Search Query
    const query = searchView.getQuery();
    if (!query) return;
    //2. Load Search results
    await model.loadSearchResults(query);
    //3.Render Results
    //console.log(model.state.search.results);
    resultsView.render(model.getSearchResultPage());
    //4. Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {}
};
const controlPagination = function (goToPage) {
  //1.Render new result
  resultsView.render(model.getSearchResultPage(goToPage));
  //4. Render new pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the view
  //   recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //1. Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2. Update recipe view
  recipeView.update(model.state.recipe);
  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();
    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //Change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back()
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
