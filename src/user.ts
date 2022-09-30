import { renderBlock } from './lib.js';
import  { IUser }  from './interfaces.js';
import { APILocalStorage } from './APILocalStorage.js';


export function getUserData (): IUser | null {
  const lsUserJson: string = APILocalStorage.get('user');

  if(lsUserJson) {
    try {
      const user: unknown = JSON.parse(lsUserJson);
      if(typeof user === 'object' && 'userName' in user && 'avatarUrl' in user){
        return {userName: user['userName'], avatarUrl: user['avatarUrl']};
      }
    } catch (error) {
      throw new Error(error);
    }
    return null;
  }
}

export function getFavoritesAmount(): number {
  const amount: unknown = APILocalStorage.get('favoritesAmount');
  if (amount && !!isNaN(Number(amount))) {
    return +amount;
  } else {
    return 0;
  }
}

//для теста 
export function setLocalStorageTestData(): void {
  APILocalStorage.set('user', '{"userName": "Irina", "avatarUrl": "https://via.placeholder.com/300.png/09f/fff"}');
  APILocalStorage.set('favoriteItemsAmount', '4');
}


export function renderUserBlock (userName: string, avatarUrl: string, favoriteItemsAmount?: number) {
  const favoriteItemsAmountBool = Boolean(favoriteItemsAmount);
  const items: number | string = favoriteItemsAmountBool ? favoriteItemsAmount: 'ничего нет';
  
  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatarUrl}" alt="Avatar" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <i class="heart-icon${favoriteItemsAmountBool ? ' active' : ''}"></i>${items}
          </p>
      </div>
    </div>
    `
  )
}
