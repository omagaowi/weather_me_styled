import { ChevronLeft, Cloud } from "lucide-react";
import styled from "styled-components";
import Details from "./details";
import Search from "./search";
import Share from "./share";
import { useWeather } from "../utils/stores/weather_store";

const SideStyles = styled.div`
  width: 300px;
  height: 100%;
  margin-left: 10px;
  border-radius: 7px;
  background: #161d20;
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
  .side-content {
    width: 100%;
    display: flex;
    overflow: hidden;
  }
  /* gap: 20px; */
  /* padding: 0px 20px 20px 20px; */
  p.title {
    color: #8ea3ab;
    font-size: 13px;
    padding-top: 20px;
  }
  img {
    margin-top: 10px;
    border-radius: 8px;
    width: 100%;
    cursor: pointer;
  }
  .top {
    display: none;
    width: 100%;
  }
  .map-skeleton {
    width: 100%;
    margin-top: 10px;
    height: 170px;
    border-radius: 8px;
  }
  .top button {
    width: 40px;
    height: 40px;
    background: #1b262a;
    border: 1px solid #304247;
    border-radius: 7px;
    display: flex;
    color: #ffff;
    margin: 10px 0px 0px 20px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .details,
  .search,
  .share {
    width: 100%;
    padding: 0px 15px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow-x: hidden;
    transition-property: all;
    transition-duration: 200ms;
  }
  @media (max-width: 845px) {
    margin-left: 0px;
    .slide-content {
      padding: 0px 10px;
    }
    &.show {
      width: 100%;
      display: flex;
    }
    &.hide {
      display: none;
    }
    .top {
      display: flex;
    }
  }

  .details.slide1 {
    margin-left: calc(-100%);
  }

  .details.slide2 {
    margin-left: calc(-200%);
  }
  .download-report {
    width: 100%;
    height: 40px;
    background: #1c262b;
    border: 1px solid #304247;
    margin-top: 10px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    color: #60848e;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }
  .report-ref{
    padding: 5px;
  }
`;

const Side = () => {
  const { sideState, setSideState } = useWeather();
  console.log(sideState);
  return (
    <SideStyles className={sideState ? "show" : "hide"}>
      <div className="top">
        <button
          onClick={() => {
            setSideState(null);
          }}
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="side-content">
        <div
          className={`details ${sideState == "search" ? "slide1" : sideState == "share" ? "slide2" : ""}`}
        >
          <Details />
        </div>
        <div className="search">
          <Search />
        </div>
        <div className="share">
          <Share />
        </div>
      </div>
    </SideStyles>
  );
};

export default Side;
