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
// export interface IPlace {}

// export interface ISearchCallBack {
//   (error?: Error, places?: IPlace[]): void
// }

