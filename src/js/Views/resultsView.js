import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = "Couldn't find the recipe! Try another one";
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
