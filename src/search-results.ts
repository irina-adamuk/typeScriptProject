import { renderBlock } from './lib.js';
import { APILocalStorage } from './APILocalStorage.js';
import { IPlaceCommon, IBookData, ISearchFormData } from './interfaces.js';
import { renderToast, MessageType } from './lib.js';
import { ProviderApi, ProviderSDK } from './providers.js';
import { getPlaces, getSearchFormData } from './search-form.js';

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

// export function renderEmptyOrErrorSearchBlock (reasonMessage) {
//   renderBlock(
//     'search-results-block',
//     `
//     <div class="no-results-block">
//       <img src="img/no-results.png" />
//       <p>${reasonMessage}</p>
//     </div>
//     `
//   )
// }
export function toggleFavoritesItem(event:Event) {
  const target = event.target as HTMLElement
  const id: string = target.dataset.id ?? '';
  const favoritesItem:string[] = getFavoritesList();
  const isFindItem = favoritesItem.find(itemId => itemId === id)
  if (isFindItem) {
    const newFavoritesItems = favoritesItem.filter(itemId => itemId !== id);
    APILocalStorage.set('favoriteItems', newFavoritesItems.join());
    target.classList.remove('active');
  } else {
    APILocalStorage.set('favoriteItems', [...favoritesItem, id].join());
    target.classList.add('active');
  }
}

export function getFavoritesList():string[] {
  const list = APILocalStorage.get('favoriteItems');
  if (list) {
    return list.split(',');
  }
  return [];
}

export function getBookData(event:Event) :IBookData {
  const target = event.target as HTMLElement
  if (!target) {
    throw Error('Target not found')
  }
  const id = target.dataset.id ?? '';
  const source = target.dataset.source === 'API' ? 'API' :'SDK';
  const checkInInput = (document.querySelector('#check-in-date')) as HTMLInputElement;
  const checkOutInput = (document.querySelector('#check-out-date')) as HTMLInputElement;

  return {
    id: id,
    source: source,
    checkInDate: new Date(checkInInput.value),
    checkOutDate: new Date(checkOutInput.value)
  }
}

export async function bookBtnHandler(event:Event): Promise<void> {
  const bookData = getBookData(event);
  let bookNumber = null;
  try {
    if(bookData.source === 'SDK') {
      const providerSDK = new ProviderSDK();
      bookNumber = await providerSDK.book(bookData);
    } else {
      const providerAPI = new ProviderApi();
      bookNumber = await providerAPI.book(bookData);
    }
  } catch(error) {
    console.log( error)
    const message:MessageType = {
      text: error.message,
      type: 'success'
    }
    renderToast(message
      , null);
    return;
  }

  const text = bookNumber === null ?  'Бронирование прошло успешно!' : 'Бронирование прошло успешно! Номер '  + bookNumber
  const message:MessageType = {
    text: text,
    type: 'success'
  }
  renderToast(message, {name: 'OK', handler: () => void {}})
}

const sort = {
  cheapFirst: 0,
  expensiveFirst: 1,
  // nearest: 2
}

async function sortHandler() {
  const select = document.getElementById('select') as HTMLSelectElement;
  const sortBy = +select.options[select.selectedIndex].value;
  const searchFormData = getSearchFormData();
  if (!searchFormData)return;
  const data:IPlaceCommon[] = await getPlaces(searchFormData);
  renderSearchResultsBlock(data, sortBy)
}

function sortData(data: IPlaceCommon[], sortBy:number) {

  if(sortBy === 0) {
    data.sort(function(a, b){
      return a.price-b.price
    })
  } else if(sortBy === 1) {
    data.sort(function(a, b){
      return b.price-a.price
    })
  }
}

export function renderSearchResultsBlock (data: IPlaceCommon[], sortBy = sort.cheapFirst) {
  let list = '';
  const favIds:string[] = getFavoritesList();

  //сортировка 
  sortData(data, sortBy);

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
          <select id="select">
            <option value="0">Сначала дешёвые</option>
            <option value="1">Сначала дорогие</option>
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

  const select = document.getElementById('select');
  if (!select) {
    return;
  }
  select.addEventListener('change', sortHandler);
}



