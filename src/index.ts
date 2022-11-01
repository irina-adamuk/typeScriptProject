import { renderSearchFormBlock } from './search-form.js';

import { renderSearchResultsBlock } from './search-results.js';
import { renderUserBlock, getUserData, getFavoritesAmount } from './user.js';


window.addEventListener('DOMContentLoaded', () => {
  // setLocalStorage
  const user = getUserData();
  console.log('user = ', user);
  const amount = getFavoritesAmount();
  console.log('amount = ', amount);
  renderUserBlock('', '', 0);

  renderSearchFormBlock();

  renderSearchResultsBlock([]);

})