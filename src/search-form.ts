import { renderBlock } from './lib.js';
import { renderSearchResultsBlock } from './search-results.js';
import { ISearchFormData, IPlaceCommon } from './interfaces.js';
import { renderToast } from './lib.js';
import { ProviderApi, ProviderSDK } from './providers.js';

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
          <div class="providers">
            <label><input id="homy" type="checkbox" name="provider" value="homy" /> Homy</label>
            <label><input id="flat-rent" type="checkbox" name="provider" value="flat-rent" /> FlatRent</label>
          </div>
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

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchFormData: ISearchFormData = getSearchFormData();
    const answer:IPlaceCommon[] = await getPlaces(searchFormData);
    if (answer.length === 0) {
      const message = {
        text: 'По вашему запросу ничего не найдено',
        type: 'error'
      }
      renderToast(message, null);
    } else {
      searchCallBack({error: null, data: answer});
    }
  })
}
interface ISearchCallBack {
  (data: DataI): void
}
type DataI = {
  data:IPlaceCommon[] | null,
  error: Error | null
}

const searchCallBack: ISearchCallBack = (data: DataI) => {
  
  if(data.error) {
    console.error(data.error);
  } else{
    renderSearchResultsBlock(data.data);
  }
}
export function getSearchFormData() {
  const searchForm = document.getElementById('search-form');
  const cityInput = searchForm.querySelector('#city') as HTMLInputElement;
  const checkInInput = searchForm.querySelector('#check-in-date') as HTMLInputElement;
  const checkOutInput = searchForm.querySelector('#check-out-date') as HTMLInputElement;
  const maxPriceInput = searchForm.querySelector('#max-price') as HTMLInputElement;
  const apiCheckbox = searchForm.querySelector('#homy') as HTMLInputElement;
  const sdkCheckbox= searchForm.querySelector('#flat-rent') as HTMLInputElement;

  const searchFormData: ISearchFormData = {
    city: cityInput.value,
    checkInDate: new Date(checkInInput.value),
    checkOutDate: new Date(checkOutInput.value),
    priceLimit: maxPriceInput.value === '' ? null : +maxPriceInput.value,
    isCheckedAPI: apiCheckbox.checked,
    isCheckedSDK: sdkCheckbox.checked
  }
  return searchFormData;
}

export async function getPlaces(searchFormData) {
  let answer:IPlaceCommon[] = [];
  try {    
    if(searchFormData.isCheckedAPI) {
      const providerAPI = new ProviderApi();
      const dataAPI = providerAPI.search(searchFormData);
      answer = answer.concat(await dataAPI);
    }
    if(searchFormData.isCheckedSDK) {
      const providerSDK = new ProviderSDK();
      const dataSDK = providerSDK.search(searchFormData);
      answer = answer.concat(await dataSDK);
    }
  } catch(error) {
    searchCallBack({error: error, data: []});
  }
  return answer;
}