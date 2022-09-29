import { renderBlock } from './lib.js';
const localStorage = window.localStorage;

export interface User {
  userName: string;
  avatarUrl: string;
}

export interface FavAmout {
  faveAmout: number;
}

// function getUserData (entity: User) {
//   localStorage.getItem('user');
// }

// function getFavoritesAmount(entity: FavAmout) {
//   localStorage.getItem('favoritesAmount')
// }



  
function getUserData (value: unknown) {
  if(value == null) {
    return `данные пользователя ${value}`
  }

  // if (value instanceof User) {

  // }
  localStorage.getItem('user');
}
  
function getFavoritesAmount() {
  localStorage.getItem('favoritesAmount')
}

export function renderUserBlock (name: string, avatarLink: string, favoriteItemsAmount: number) {
  const favoriteItemsAmountBool = Boolean(favoriteItemsAmount);
  const items: number | string = favoriteItemsAmountBool ? favoriteItemsAmount: 'ничего нет';
  
  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatarLink}" alt="Avatar" />
      <div class="info">
          <p class="name">${name}</p>
          <p class="fav">
            <i class="heart-icon${favoriteItemsAmountBool ? ' active' : ''}"></i>${items}
          </p>
      </div>
    </div>
    `
  )
}
