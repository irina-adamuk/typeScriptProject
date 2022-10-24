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
}
export interface IPlaceCommon {
  id: string;
  name: string;
  description: string;
  image: string[];
  bookedDates: [];
  price: number;
  remoteness: number | null;
}