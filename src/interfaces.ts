export type sourceAPI = 'API'
export type sourceCommon = 'API' | 'SDK'
export interface IUser {
  userName: string;
  avatarUrl: string;
}

export interface ISearchFormData {
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  priceLimit: number | null;
  isCheckedSDK: boolean;
  isCheckedAPI: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPlaceAPI {
  id: number;
  name: string;
  description: string;
  image: string;
  bookedDates: [];
  price: number;
  remoteness: number;
  source: sourceAPI
}
export interface IPlaceCommon {
  id: string;
  name: string;
  description: string;
  image: string[];
  bookedDates: [];
  price: number;
  remoteness: number | null;
  source: sourceCommon
}
export interface IBookData {
  id: string,
  checkInDate: Date,
  checkOutDate: Date,
  source: 'API' | 'SDK'
}