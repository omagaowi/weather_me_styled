import { Cloud, MoreVerticalIcon, Search, Share } from "lucide-react";
import styled from "styled-components";
import {
  formatDateFromMs,
  getWeatherGroup,
  useWeather,
} from "../utils/stores/weather_store";
import { formatDate } from "../utils/dateFormat";
import RenderWeatherIcon from "./renderWeather";
import { ClipLoader } from "react-spinners";

export const parseDate = (date: string) => {
  const dateMilli = new Date(date).getTime();
  return formatDate(dateMilli).fullLong;
};

const MainStyles = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-size: cover;
  border-radius: 7px;
  background-image: url("/RAIN2.png");
  .loader {
    margin-bottom: 70px;
    margin-left: 20px;
  }

  @media (max-width: 845px) {
    &.show {
      display: flex;
    }
    &.hide {
      display: none;
    }
  }
`;
const Top = styled.div`
  width: 100%;
  padding: 0px 20px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    color: #fff;
    font-weight: 600;
    font-size: 22px;
  }
  .controls {
    display: flex;
    align-items: center;
  }
  .controls button {
    width: 30px;
    height: 30px;
    background: none;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    justify-content: center;
    margin: 0px 5px;
  }
  .controls button:hover {
    background: rgb(255, 255, 255, 0.6);
  }
  button.active {
    background: rgb(255, 255, 255, 0.6);
  }
`;

export const Bottom = styled.div`
  margin-bottom: 50px;
  display: flex;
  margin-left: 20px;
  align-items: center;
  max-width: 600px;
  width: 95%;
  .value {
    display: flex;
    align-items: start;
    margin: 0;
  }
  h1 {
    color: #fff;
    font-size: 100px;
    margin: 0;
    font-weight: 300;
  }
  .value p {
    margin: 0;
    margin-top: 33px;
    font-size: 20px;
    color: #fff;
  }
  .main {
    display: flex;
    margin-left: 20px;
    overflow: hidden;
    flex-direction: column;
  }
  .main h2 {
    color: #e0e0e0;
    font-weight: 400;
    white-space: nowrap;
    font-size: 50px;
    line-height: 60px;
  }
  .date {
    display: flex;
    align-items: center;
  }
  .date p {
    margin: 0;
    color: #e0e0e0;
  }
  .date span {
    color: #e0e0e0;
  }
  .condition {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .condition p {
    margin: 0;
    font-size: 13px;
    color: #e0e0e0;
  }

  @media (max-width: 550px) {
    &.main-bottom {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
    }
    &.main-bottom .main,
    .condition {
      margin-left: 0px;
    }
    &.main-bottom h1 {
      line-height: 100px;
    }
    &.main-bottom .condition {
      margin-top: 15px;
    }
  }
`;

const Main = () => {
  const { setSideState, sideState, activeWeather } = useWeather();
  return (
    <MainStyles className={sideState ? "hide" : "show"}>
      <Top>
        <h2>weather me</h2>
        <div className="controls">
          <button
            className={sideState == "share" ? "active" : ""}
            onClick={() => {
              setSideState("share");
            }}
          >
            <Share size={20} color="#fff" />
          </button>
          <button
            className={sideState == "search" ? "active" : ""}
            onClick={() => {
              setSideState("search");
            }}
          >
            <Search size={20} color="#fff" />
          </button>
          <button
            className={sideState == "details" ? "active" : ""}
            onClick={() => {
              setSideState("details");
            }}
          >
            <MoreVerticalIcon size={20} color="#fff" />
          </button>
        </div>
      </Top>
      {activeWeather ? (
        <Bottom className="main-bottom">
          <div className="value">
            <h1>{activeWeather?.weather.conditions.temperature.toFixed()}</h1>
            <p>°C</p>
          </div>
          <div className="main">
            <h2> {activeWeather?.place.text || ""}</h2>
            <div className="date">
              <p>
                {activeWeather
                  ? `${formatDate((activeWeather?.time.dt || 0) * 1000).time}`
                  : ""}
              </p>
              <span>-</span>
              <p>
                {activeWeather
                  ? parseDate(
                      formatDateFromMs((activeWeather?.time?.dt || 0) * 1000) ||
                        "",
                    )
                  : ""}
              </p>
            </div>
          </div>
          <div className="condition">
            <RenderWeatherIcon
              group={getWeatherGroup(
                activeWeather?.weather.description.id || 0,
              )}
              //   className="text-[#e1e1e1]"
            />
            <p>
              {" "}
              {getWeatherGroup(activeWeather?.weather.description.id || 1000)}
            </p>
          </div>
        </Bottom>
      ) : (
        <ClipLoader className="loader" size={70} color="#fff" />
      )}
    </MainStyles>
  );
};

export default Main;
