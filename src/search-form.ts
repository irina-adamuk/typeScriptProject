import { renderBlock } from './lib.js';
const oneDayInMilliseconds: number = 24*3600*1000;
const standartDayDelayNumber = 2;
// standartMonthDelayNumber может быть числом от 1 до 12, где 2 означает прибавление 1 месяца
const standartMonthDelayNumber = 2;
// по умолчанию дата выезда через 2 дня
const currentDate: Date = new Date();
const standartCheckInDate = currentDate.toLocaleDateString('en-CA');
const standartCheckOutDate = new Date(currentDate.getTime() + standartDayDelayNumber * oneDayInMilliseconds);
const earliestCheckInDate = currentDate.toLocaleDateString('en-CA');

currentDate.setMonth(currentDate.getMonth() + standartMonthDelayNumber);
currentDate.setDate(0);
const latestChecOutDate = currentDate.toLocaleDateString('en-AC');


export function renderSearchFormBlock () {
  renderBlock(
    'search-form-block',
    `
    <form>
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
            <input id="check-in-date" type="date" value="${standartCheckInDate}" min="${earliestCheckInDate}" max="${latestChecOutDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${standartCheckOutDate}" min="${earliestCheckInDate}" max="${latestChecOutDate}" name="checkout" />
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
}
