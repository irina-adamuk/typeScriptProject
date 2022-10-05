import { renderBlock } from './lib.js';

import { ISearchFormData, IPlace } from './interfaces.js';

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
      maxPrice: maxPriceInput.value === '' ? null : +maxPriceInput.value,
    }
    search(searchFormData, searchCallBack);
  })
}
interface ISearchCallBack {
  (data: DataI): void
}
type DataI = {
  data:IPlace | null,
  error: Error | null
}

const searchCallBack: ISearchCallBack = (data: DataI) => {
  if(data.error) {
    console.error(data.error);
  } else{
    console.log('searchCallBack', data.data);
  }
  
}

export function search( data: ISearchFormData, searchCallBack: ISearchCallBack) {
  console.log('function search searchFormData = ', data);

  const answer = Boolean(Math.random() < 0.5);
  if (answer) {
    searchCallBack({error: new Error('error'), data: []});
  } else {
    const places: IPlace[] = [];
    searchCallBack({error: null, data: places});
  }
}
