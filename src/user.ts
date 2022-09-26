import { renderBlock } from './lib.js'

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
