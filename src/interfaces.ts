export interface IUser {
  userName: string;
  avatarUrl: string;
}

export interface ISearchFormData {
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  priceLimit: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPlace {
  id: number;
  // title?: string;
  name: string;
  description?: string;
  image?: string;
  // coordinates?: number[];
  bookedDates?: [];
  // totalPrice?: number;
  price: number;
  remoteness: number;
}