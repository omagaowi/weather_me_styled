import styled from "styled-components";
import Main from "./components/main";
import Side from "./components/side";
import Share from "./components/share";
import { useWeather } from "./utils/stores/weather_store";
import { tryCatch } from "./utils/tryCatch";
import axios from "axios";
import { useEffect } from "react";
import { loadWeather } from "./utils/load_weather";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

export const root_url = "https://weather-me-api-bd36.vercel.app/api/v1";

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  padding: 10px;
  background: #2b3939;
`;

function App() {
  const {
    activeWeather,
    setActiveWeather,
    setActiveWeatherLoading,
    setActiveWeatherError,
    sideState,
    setSideState,
  } = useWeather();

  // console.log(activeWeather);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const report_id = queryParams.get("share");

  const loadReport = async (report_id: string) => {
    const { data, error } = await tryCatch(
      axios.get(`${root_url}/places/weather/share/${report_id}`),
    );
    if (error) {
      throw error;
    }
    return data.data;
  };

  // console.log(activeWeather)

  useEffect(() => {
    setActiveWeatherLoading(true);
    if (report_id) {
      loadReport(report_id)
        .then((data) => {
          setActiveWeather({
            ...data.report,
            forecast: [],
          });
        })
        .catch((error) => {
          toast.error("Unable to get weather report");
          setActiveWeatherError(error);
        });
    } else {
      loadWeather(null, null)
        .then((data) => {
          setActiveWeather(data);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message || "Error loading weather");
          setActiveWeatherError(error);
          // console.log(error)
        });
    }
  }, []);
  return (
    <Root>
      <Main />
      <Side />
      <Toaster />
    </Root>
  );
}

export default App;
