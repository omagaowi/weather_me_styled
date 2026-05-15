import { create } from "zustand";

export interface Place {
  text: string | null;
  place_id: string;
  longitude: number | null;
  latitude: number | null;
  map_image: string | null;
}

export interface Weather {
  longitude: number;
  latitude: number;
  // date: number;
  conditions: {
    temperature: number;
    speed: number;
    humidity: number;
    pressure: number;
  };
  description: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export interface Time {
  longitude: number | null;
  latitude: number | null;
  dt: number;
}

export interface Forecast {
  date: number;
  weather: Weather;
}
export interface FullWeather {
  place: Place;
  weather: Weather;
  time: Time;
  forecast: Forecast[];
}

export interface SearchResult extends Place {
  type: "history" | "live";
}

export interface ReportType {
   place: Place;
  weather: Weather;
  time: Time;
  report_id: string
}


export interface WeatherState {
  activeWeather: FullWeather | null;
  setActiveWeather: (payload: FullWeather | null) => void;
  sideOpen: boolean;
  setSideOpen: (payload: boolean) => void;
  sideState: "search" | "details" | "share" | null;
  setSideState: (payload: "search" | "details" | "share" | null) => void;
  activeWeatherLoading: boolean;
  setActiveWeatherLoading: (payload: boolean) => void;
  activeWeatherError: Error | null;
  setActiveWeatherError: (payload: Error | null) => void;
}

//   place: {
//     text: "",
//     place_id: "",
//     longitude: null,
//     latitude: null,
//     map_image: null,
//   },
//   weather: {
//     longitude: 0,
//     latitude: 0,
//     conditions: {
//       temperature: 0,
//       speed: 0,
//       humidity: 0,
//       pressure: 0,
//     },
//     description: {
//       id: 0,
//       main: "",
//       description: "",
//       icon: "",
//     },
//   },
//   time: {
//     longitude: null,
//     latitude: null,
//     date: null,
//     day: "",
//     month: "",
//     year: "",
//     hour: "",
//     minute: "",
//   },
//   forecast: false,
// };

export const useWeather = create<WeatherState>((set) => ({
  activeWeather: null,
  setActiveWeather: (payload) => set({ activeWeather: payload }),
  activeWeatherLoading: true,
  setActiveWeatherLoading: (payload) =>
    set({
      activeWeatherLoading: payload,
    }),
  sideOpen: false,
  setSideOpen: (payload) =>
    set({
      sideOpen: payload,
    }),
  sideState: null,
  setSideState: (payload) =>
    set({
      sideState: payload,
    }),
  activeWeatherError: null,
  setActiveWeatherError: (payload) =>
    set({
      activeWeatherError: payload,
    }),
}));

export function formatDateFromMs(ms: number): string {
  const date = new Date(ms);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export type WeatherGroup =
  | "Thunderstorm"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Atmosphere"
  | "Clear"
  | "Clouds"
  | "Unknown";

export function getWeatherGroup(id: number): WeatherGroup {
  if (id >= 200 && id < 300) return "Thunderstorm";
  if (id >= 300 && id < 400) return "Drizzle";
  if (id >= 500 && id < 600) return "Rain";
  if (id >= 600 && id < 700) return "Snow";
  if (id >= 700 && id < 800) return "Atmosphere";
  if (id === 800) return "Clear";
  if (id > 800 && id < 900) return "Clouds";

  return "Unknown";
}
