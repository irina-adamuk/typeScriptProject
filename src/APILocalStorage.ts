export const localStorage = window.localStorage;

export const APILocalStorage = {
  get: (key:string) => localStorage.getItem(key),
  set: (key: string, value: string) => localStorage.setItem(key, value),
}