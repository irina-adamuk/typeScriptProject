export interface IUser {
  userName: string;
  avatarUrl: string;
}

export interface ISearchFormData {
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  maxPrice: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPlace {}