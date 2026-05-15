import { Cloud } from "lucide-react";
import styled from "styled-components";
import {
  formatDateFromMs,
  getWeatherGroup,
  useWeather,
} from "../utils/stores/weather_store";
import Skeleton from "./skeleton";
import RenderWeatherIcon from "./renderWeather";
import { formatDate } from "../utils/dateFormat";
import { useNavigate } from "react-router-dom";

export const StatGrid = styled.div`
  width: 100%;
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  .card {
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* background: #030303; */
  }
  .stat {
    display: flex;
    align-items: end;
  }
  .value {
    font-size: 30px;
    font-weight: 300;
    color: #e9f1f4;
  }
  .unit {
    font-size: 12px;
    /* font-weight: 100; */
    color: #8ea3ab;
    margin: 0px 0px 10px 4px;
  }
  .label {
    color: #b9c9cf;
    font-size: 12px;
    margin-top: -5px;
  }
  .stat-skeleton {
    width: 100%;
    height: 100%;
    border-radius: 7px;
  }
`;

export const ForecastGrid = styled.div`
  width: 100%;
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 16px;
  .card {
    height: 90px;
    background: #1b262a;
    border: 1px solid #304247;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .card:hover {
    background-color: #223036;
    transition: all 0.3s ease;
    border: 1px solid #304247;
    transform: scale(1.03);
  }
  .card.active {
    background-color: #223036;
    transition: all 0.3s ease;
    border: 1px solid #304247;
    transform: scale(1.03);
  }
  .card svg {
    color: #ffff;
  }
  .card p.day {
    margin: 0;
    color: #96a8af;
    text-transform: uppercase;
    font-size: 13px;
    margin-top: 5px;
  }
  .card p.digit {
    color: #ecf2f5;
    font-weight: 600;
    font-size: 13px;
    margin-top: 5px;
  }
`;

const Details = () => {
  const { activeWeather, setActiveWeather } = useWeather();
  const navigate = useNavigate();
  const metricItems = [
    {
      label: "Temperature",
      unit: "DEG",
      value: activeWeather?.weather.conditions.temperature,
    },
    {
      label: "Wind Speed",
      unit: "MPH",
      value: activeWeather?.weather.conditions.speed,
    },
    {
      label: "Humidity",
      unit: "%",
      value: activeWeather?.weather.conditions.humidity,
    },
    {
      label: "Pressure",
      unit: "mPa",
      value: activeWeather?.weather.conditions.pressure,
    },
  ];

  const forecastItems = activeWeather?.forecast.slice(1) ?? [];
  return (
    <>
      {" "}
      <p className="title">LIVE CONDITIONS</p>
      <StatGrid>
        {metricItems.map((metric, index) => (
          <div className="card">
            {typeof metric.value === "number" ? (
              <>
                <div className="stat">
                  <p className="value">{metric.value.toFixed()}</p>
                  <p className="unit">{metric.unit}</p>
                </div>
                <p className="label">{metric.label}</p>
              </>
            ) : (
              <Skeleton className="stat-skeleton" />
            )}
          </div>
        ))}
      </StatGrid>
      {forecastItems.length > 0 && (
        <>
          <p className="title">5 DAY FORECAST</p>
          <ForecastGrid>
            {forecastItems.map((item) => (
              <div
                className={activeWeather?.time.dt == item.date ? "card active" : "card"}
                key={item.date}
                onClick={() => {
                  if (!activeWeather) {
                    return;
                  }

                  setActiveWeather({
                    ...activeWeather,
                    weather: {
                      ...item.weather,
                      conditions: {
                        ...item.weather.conditions,
                        temperature: item.weather.conditions.temperature - 273,
                      },
                    },
                    time: {
                      ...activeWeather.time,
                      dt: item.date,
                    },
                  });
                }}
              >
                <RenderWeatherIcon
                  className="text-[#fff]"
                  group={getWeatherGroup(item.weather.description.id)}
                />
                <p className="day">
                  {formatDate(formatDateFromMs(item.date * 1000)).dayWordsShort}
                </p>
                <p className="digit">
                  {" "}
                  {(item.weather.conditions.temperature - 273).toFixed(0)}°
                </p>
              </div>
            ))}
          </ForecastGrid>
        </>
      )}
      <p className="title">MAP</p>
      {activeWeather?.place?.map_image ? (
        <img
          src={activeWeather.place.map_image}
          alt="Map preview"
          onClick={() => {
            window.open(activeWeather?.place?.map_image || "", "_blank");
            // navigate(`/map?url=${activeWeather?.place.map_image}`);
          }}
        />
      ) : (
        <Skeleton className="map-skeleton" />
      )}
    </>
  );
};

export default Details;
