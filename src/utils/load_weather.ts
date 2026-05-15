import axios from "axios";
import { tryCatch } from "./tryCatch";
import { root_url } from "../App";

export async function getLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  if (!("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported by this browser.");
  }

  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    },
  );
}

export const fetchWeather = async (
  lon: number | null,
  lat: number | null,
  place_id: string | null,
  text: string | null,
) => {
  if (place_id && text) {
    const { data: weatherData, error: weatherError } = await tryCatch(
      axios.get(`${root_url}/places/weather?place_id=${place_id}&text=${text}`),
    );
    if (weatherError) {
      throw weatherError;
    }
    return weatherData.data;
  } else if (lon && lat) {
    const { data: weatherData, error: weatherError } = await tryCatch(
      axios.get(`${root_url}/places/weather?lon=${lon}&lat=${lat}`),
    );
    if (weatherError) {
      throw weatherError;
    }
    return weatherData.data;
  }
};

export const loadWeather = async (place_id: string | null, text: string | null) => {
  if (place_id && text) {
    const { data, error } = await tryCatch(
      fetchWeather(null, null, place_id, text),
    );
    if (error) {
      throw error;
    }
    return data;
  } else {  
    const { data: location, error: locationError } =
      await tryCatch(getLocation());
    if (locationError) {
      throw locationError;
    }
    const { data, error } = await tryCatch(
      fetchWeather(location.longitude, location.latitude, null, null),
    );
    if (error) {
      throw error;
    }
    return data;
  }
};
