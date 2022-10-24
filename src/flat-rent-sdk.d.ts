export type backendPort = 3000 | number
export type localStorageKey = 'flat-rent-db'

export interface IPlaceSDK {
  id: string,
  title: string,
  details: string,
  photos: string[],
  coordinates: number[],
  bookedDates: [],
  totalPrice: number
}

export interface ISearchParams {
  city: string,
  checkInDate: Date,
  checkOutDate: Date,
  priceLimit: number
}

export function cloneDate(date:Date): Date

export function addDays(date: Date, days: number): Date

export class FlatRentSdk {
  get(id:string): Promise<IPlaceSDK[] | null>

  search(parameters:ISearchParams):IPlaceSDK[]

  book(flatId:number, checkInDate:Date, checkOutDate:Date) : number
}