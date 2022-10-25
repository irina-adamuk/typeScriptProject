import { renderBlock } from './lib.js';
import { APILocalStorage } from './APILocalStorage.js';
import { IPlaceCommon, IBookData } from './interfaces.js';
import { FlatRentSdk } from './flat-rent-sdk.js';
import { renderToast, MessageType } from './lib.js';

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

export function getBookData(event) :IBookData {
  const id: string = event.target.dataset.id;
  const source: 'API' | 'SDK' = event.target.dataset.source;
  const checkInInput = (document.querySelector('#check-in-date')) as HTMLInputElement;
  const checkOutInput = (document.querySelector('#check-out-date')) as HTMLInputElement;

  return {
    id: id,
    source: source,
    checkInDate: new Date(checkInInput.value),
    checkOutDate: new Date(checkOutInput.value)
  }
}

export async function  bookSDK(bookData: IBookData) {
  const rentSDK = new FlatRentSdk();
  const bookAnswerSDK = await rentSDK.book(bookData.id, bookData.checkInDate, bookData.checkOutDate)
  console.log('Booked SDK', bookAnswerSDK);
  let message:MessageType;

  if(bookAnswerSDK !== null) {
    message  = {
      text: `Бронирование прошло успешно! Номер бронирования ${bookAnswerSDK}`,
      type: 'success'
    }
  }else {
    message  = {
      text: 'Что-то пошло не так!',
      type: 'error'
    }
  }
  renderToast(message, {name: 'OK', handler: null})
}
export function dateToUnixStamp(date) {
  return date.getTime() / 1000
}

export async function  bookAPI(bookData: IBookData) {
  const url = `http://localhost:3030/places/${bookData.id}?` +
  `checkInDate=${dateToUnixStamp(bookData.checkInDate)}&` +
  `checkOutDate=${dateToUnixStamp(bookData.checkOutDate)}&`
  const bookAnswerAPI = await fetch(url, {method: 'PATCH'})
  console.log('Booked API', bookAnswerAPI);

  let message:MessageType;
  if(bookAnswerAPI.status === 200) {
    message  = {
      text: 'Бронирование прошло успешно!',
      type: 'success'
    }
  }else {
    message  = {
      text: 'Что-то пошло не так!',
      type: 'error'
    }
  }
  renderToast(message, {name: 'OK', handler: null})
}

export function bookBtnHandler(event): void {
  const bookData = getBookData(event);

  if(bookData.source === 'SDK') {
    bookSDK(bookData);
  } else {
    bookAPI(bookData);
  }
}





export function renderSearchResultsBlock (data: IPlaceCommon[]) {
  let list = '';
  const favIds:string[] = getFavoritesList();
  data.forEach((item) => {
    const isFavorite = favIds.find((favId) => { return favId === (item.id).toString();});
    const activeClass = isFavorite === undefined ? '' : 'active';
    const remoteness = item.remoteness === null ? '' : `<div class="result-info--map"><i class="map-icon"></i> ${item.remoteness} км от вас</div>`
    const template =
    `<li class="result">
    <div class="result-container">
      <div class="result-img-container">
        <div class="favorites ${activeClass} js-favoriteToggle" data-id="${item.id}"></div>
        <img class="result-img" src="${item.image[0]}" alt="">
      </div>	
      <div class="result-info">
        <div class="result-info--header">
          <p>${item.name}</p>
          <p class="price">${item.price}&#8381;</p>
        </div>
        ${remoteness}
        <div class="result-info--descr">${item.description}</div>
        <div class="result-info--footer">
          <div>
            <button class="js-book-btn" data-id="${item.id}" data-source="${item.source}">Забронировать</button>
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
  const favoriteButtons = document.querySelectorAll('.js-favoriteToggle');
  const bookBtns = document.querySelectorAll('.js-book-btn');
  bookBtns.forEach((item) => {
    item.addEventListener('click', bookBtnHandler);
  })

  favoriteButtons.forEach((item) => {
    item.addEventListener('click', toggleFavoritesItem);
  })
}

// Добрый вечер в этой ветке Вы можете проверить задание №3 и № 4 

