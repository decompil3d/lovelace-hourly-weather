declare module 'solar-calculator' {
  export function rise(date: Date, latitude: number, longitude: number): Date;
  export function set(date: Date, latitude: number, longitude: number): Date;
}
