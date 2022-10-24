import { renderBlock } from './lib.js';
import { renderSearchResultsBlock } from './search-results.js';
import { ISearchFormData, IPlace } from './interfaces.js';
// import { FlatRentSdk } from './flat-rent-sdk.js';

export function renderSearchFormBlock () {
  const oneDayInMilliseconds = 86400000;
  const standartDayDelayNumber = 2;
  // standartMonthDelayNumber может быть числом от 1 до 12, где 2 означает прибавление 1 месяца

  const standartMonthDelayNumber = 2;
  // по умолчанию дата выезда через 2 дня

  const date: Date = new Date();
  const standartCheckInDate = date.toLocaleDateString('en-CA');
  const standartCheckOutDate = new Date(date.getTime() + standartDayDelayNumber * oneDayInMilliseconds).toLocaleDateString('en-CA');
  const earliestCheckInDate = date.toLocaleDateString('en-CA');

  date.setMonth(date.getMonth() + standartMonthDelayNumber);
  date.setDate(0);
  const latestCheckOutDate = date.toLocaleDateString('en-CA');
  
  renderBlock(
    'search-form-block',
    `
    <form id="search-form">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${standartCheckInDate}" min="${earliestCheckInDate}" max="${latestCheckOutDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${standartCheckOutDate}" min="${earliestCheckInDate}" max="${latestCheckOutDate}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityInput = searchForm.querySelector('#city') as HTMLInputElement;
    const checkInInput = searchForm.querySelector('#check-in-date') as HTMLInputElement;
    const checkOutInput = searchForm.querySelector('#check-out-date') as HTMLInputElement;
    const maxPriceInput = searchForm.querySelector('#max-price') as HTMLInputElement;

    const searchFormData: ISearchFormData = {
      city: cityInput.value,
      checkInDate: new Date(checkInInput.value),
      checkOutDate: new Date(checkOutInput.value),
      priceLimit: maxPriceInput.value === '' ? null : +maxPriceInput.value,
    }
    searchFromAPI(searchFormData, searchCallBack);
  })
}
interface ISearchCallBack {
  (data: DataI): void
}
type DataI = {
  data:IPlace[] | null,
  error: Error | null
}

const searchCallBack: ISearchCallBack = (data: DataI) => {
  if(data.error) {
    console.error(data.error);
  } else{
    console.log('searchCallBack', data.data);
    renderSearchResultsBlock(data.data);
  }
}


function dateToUnixStamp(date) {
  return date.getTime() / 1000
}

function responseToJson(requestPromise) {
  return requestPromise
    .then((response) => {
      return response.text()
    })
    .then((response) => {
      return JSON.parse(response)
    })
}

function search(checkInDate, checkOutDate, maxPrice) {
  let url = 'http://localhost:3030/places?' +
  `checkInDate=${dateToUnixStamp(checkInDate)}&` +
  `checkOutDate=${dateToUnixStamp(checkOutDate)}&` +
  'coordinates=59.9386,30.3141'

  if (maxPrice != null) {
    url += `&maxPrice=${maxPrice}`
  }

  return responseToJson(fetch(url))
}

export async function searchFromAPI( data: ISearchFormData, searchCallBack: ISearchCallBack) {
  console.log('function search searchFormData = ', data);

  let url = 'http://localhost:3030/places?' +
  `checkInDate=${dateToUnixStamp(data.checkInDate)}&` +
  `checkOutDate=${dateToUnixStamp(data.checkOutDate)}&` +
  'coordinates=59.9386,30.3141'

  if (data.priceLimit != null) {
    url += `&maxPrice=${data.priceLimit}`
  }

  const answer = await responseToJson(fetch(url))

  if (!answer) {
    searchCallBack({error: new Error('error'), data: []});
  } else {
    searchCallBack({error: null, data: answer});
  }
}

// export async function search( data: ISearchFormData, searchCallBack: ISearchCallBack) {
//   console.log('function search searchFormData = ', data);

//   const rentSDK = new FlatRentSdk();
//   const answer: any = await rentSDK.search(data);  

//   if (!answer) {
//     searchCallBack({error: new Error('error'), data: []});
//   } else {
//     searchCallBack({error: null, data: answer});
//   }
// }


