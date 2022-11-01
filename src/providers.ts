import { FlatRentSdk, IPlaceSDK } from './flat-rent-sdk.js';
import { IBookData, IPlaceAPI, IPlaceCommon, IProvider, ISearchFormData } from './interfaces.js';


export class ProviderApi implements IProvider {
  async book(bookData: IBookData): Promise<number> {
    const url = `http://localhost:3030/places/${bookData.id}?` +
      `checkInDate=${this._dateToUnixStamp(bookData.checkInDate)}&` +
      `checkOutDate=${this._dateToUnixStamp(bookData.checkOutDate)}&`

    const bookAnswerAPI:Response = await fetch(url, {method: 'PATCH'})
    if(bookAnswerAPI.status === 200) {
      return null;
    } else {
      const body = await bookAnswerAPI.json()
      console.log(`Error from API: code ${bookAnswerAPI.status}, message: ${body.message}`)
      throw new Error(body.message);
    }
  }

  async search( data: ISearchFormData):Promise<IPlaceCommon[]> {

    let url = 'http://localhost:3030/places?' +
    `checkInDate=${this._dateToUnixStamp(data.checkInDate)}&` +
    `checkOutDate=${this._dateToUnixStamp(data.checkOutDate)}&` +
    'coordinates=59.9386,30.3141'
  
    if (data.priceLimit != null) {
      url += `&maxPrice=${data.priceLimit}`
    }
  
    const dataAPI:IPlaceAPI[] = await this._responseToJson(fetch(url))
    
    const IPlaceCommonData:IPlaceCommon[] = dataAPI.map((item) => {
      return {
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        image: [ item.image ],
        bookedDates: item.bookedDates,
        price: item.price,
        remoteness: item.remoteness,
        source: 'API'
      }
    })
    return IPlaceCommonData;
  }

  _dateToUnixStamp(date) {
    return date.getTime() / 1000
  }

  _responseToJson(requestPromise) {
    return requestPromise
      .then((response) => {
        return response.text()
      })
      .then((response) => {
        return JSON.parse(response)
      })
  }
}

export class ProviderSDK implements IProvider {
  async book(bookData: IBookData): Promise<number> {
    const rentSDK = new FlatRentSdk();
    const bookAnswerSDK = await rentSDK.book(bookData.id, bookData.checkInDate, bookData.checkOutDate)
    console.log('Booked SDK', bookAnswerSDK);

    if(bookAnswerSDK !== null) {
      return bookAnswerSDK;
    } else {
      throw new Error('Error from SDK');
    }
  }

  async search( data: ISearchFormData):Promise<IPlaceCommon[]> {
    const rentSDK = new FlatRentSdk();
    const dataSDK: IPlaceSDK[] = await rentSDK.search(data);

    const IPlaceCommonData:IPlaceCommon[] = dataSDK.map((item) => {
      return {
        id: item.id,
        name: item.title,
        description: item.details,
        image: item.photos,
        bookedDates: item.bookedDates,
        price: item.totalPrice,
        remoteness: null,
        source: 'SDK'
      }
    })
    return IPlaceCommonData;
  }
}