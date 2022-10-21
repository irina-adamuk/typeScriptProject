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
  id?: string;
  title?: string;
  details?: string;
  photos?: string[];
  coordinates?: number[];
  bookedDates?: [];
  totalPrice?: number
}