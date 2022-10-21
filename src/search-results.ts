import { renderBlock } from './lib.js';
import { APILocalStorage } from './APILocalStorage.js';
import { IPlace } from './interfaces.js';

export function renderSearchStubBlock () {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock (reasonMessage) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}
export function toggleFavoritesItem(event) {
  const id: string = event.target.dataset.id;
  const favoritesItem:string[] = getFavoritesList();
  const isFindItem = favoritesItem.find(itemId => itemId === id)
  if (isFindItem) {
    const newFavoritesItems = favoritesItem.filter(itemId => itemId !== id);
    APILocalStorage.set('favoriteItems', newFavoritesItems.join());
    event.target.classList.remove('active');
  } else {
    APILocalStorage.set('favoriteItems', [...favoritesItem, id].join());
    event.target.classList.add('active');
  }
}
export function getFavoritesList():string[] {
  const list = APILocalStorage.get('favoriteItems');
  if (list) {
    return list.split(',');
  }
  return [];
}



export function renderSearchResultsBlock (data: IPlace[]) {
  let list = '';
  const favIds:string[] = getFavoritesList();
  data.forEach((item) => {
    const isFavorite = favIds.find((favId) => { return favId === item.id;});
    const activeClass = isFavorite === undefined ? '' : 'active';
    const template =
    `<li class="result">
    <div class="result-container">
      <div class="result-img-container">
        <div class="favorites ${activeClass} js-favoriteToggle" data-id="${item.id}"></div>
        <img class="result-img" src="${item.photos[0]}" alt="">
      </div>	
      <div class="result-info">
        <div class="result-info--header">
          <p>${item.title}</p>
          <p class="price">${item.totalPrice}&#8381;</p>
        </div>
        <div class="result-info--map"><i class="map-icon"></i> 2.5км от вас</div>
        <div class="result-info--descr">${item.details}</div>
        <div class="result-info--footer">
          <div>
            <button>Забронировать</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  `
    list += template;
  })
  
  const html = `
    <div class="search-results-header">
      <p>Результаты поиска</p>
      <div class="search-results-filter">
        <span><i class="icon icon-filter"></i> Сортировать:</span>
          <select>
            <option selected="">Сначала дешёвые</option>
            <option selected="">Сначала дорогие</option>
            <option>Сначала ближе</option>
        </select>
      </div>
    </div>
    <ul class="results-list">${list}</ul>
  `;

  renderBlock('search-results-block', html);
  const favoriteButton = document.querySelectorAll('.js-favoriteToggle');

  favoriteButton.forEach((item) => {
    item.addEventListener('click', toggleFavoritesItem);
  })
}



