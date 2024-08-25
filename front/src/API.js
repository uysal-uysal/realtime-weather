import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
});

export const getWeatherData = () => {
  return api.get(`/weather`);
};

export const getLastWeatherData = () => {
  return api.get(`/latestWeather`);
};

export const scheduleJob = (lat, lon) => {
  return api.post(`/schedule-job`, { lat, lon });
};
