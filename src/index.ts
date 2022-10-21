import { renderSearchFormBlock } from './search-form.js';
//import { renderSearchStubBlock } from './search-results.js';
import { renderSearchResultsBlock } from './search-results.js';
import { renderUserBlock, getUserData, getFavoritesAmount } from './user.js';
// import { renderToast } from './lib.js';

window.addEventListener('DOMContentLoaded', () => {
  // setLocalStorage
  const user = getUserData();
  console.log('user = ', user);
  const amount = getFavoritesAmount();
  console.log('amount = ', amount);
  renderUserBlock('', '', 0);

  renderSearchFormBlock();
  //renderSearchStubBlock();
  renderSearchResultsBlock([]);
  // renderToast(
  //   {text: 'Это пример уведомления. Используйте его при необходимости', type: 'success'},
  //   {name: 'Понял', handler: () => {console.log('Уведомление закрыто')}}
  // )
})