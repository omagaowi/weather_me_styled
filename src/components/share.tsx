import { Clipboard, Download } from "lucide-react";
import styled from "styled-components";
import { Bottom, parseDate } from "./main";
import {
  formatDateFromMs,
  getWeatherGroup,
  useWeather,
  type ReportType,
} from "../utils/stores/weather_store";
import { formatDate } from "../utils/dateFormat";
import RenderWeatherIcon from "./renderWeather";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { tryCatch } from "../utils/tryCatch";
import { root_url } from "../App";
import { toPng } from "html-to-image";
import { ForecastGrid, StatGrid } from "./details";
import Skeleton from "./skeleton";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const LinkBar = styled.div`
  width: 100%;
  height: 40px;
  background: #1c262b;
  border: 1px solid #304247;
  margin-top: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  svg {
    margin: 0px 5px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .text {
    flex: 1;
    outline: none;
    border: none;
    overflow: hidden;
    padding: 0px 5px;
    color: #60848e;
    background: none;
  }
  p {
    white-space: nowrap;
    font-size: 12px;
  }
`;

const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  min-height: 300px;
  height: fit-content;
  margin-top: 10px;
  padding: 10px;
  background: #1c262b;
  border: 1px solid #304247;
  .card-main {
    width: 100%;
    aspect-ratio: 3 / 2;
    background-image: url("/RAIN2.png");
    background-size: cover;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: end;
    overflow: hidden;
  }
  .report-bottom {
    margin: 0;
    width: 100%;
    max-width: none;
    padding: 8px 10px 0;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .report-bottom h1 {
    font-size: 56px;
    line-height: 1;
  }
  .report-bottom .value p {
    margin-top: 20px;
    font-size: 16px;
  }
  .report-bottom .main {
    overflow: hidden;
    margin-left: 0;
  }
  .report-bottom .main h2 {
    font-size: 30px;
    line-height: 1.05;
  }
  .report-bottom .date p {
    font-size: 11px;
  }
  .report-bottom .condition {
    margin-left: 0;
    align-items: center;
    flex-shrink: 0;
  }
  .report-bottom .condition p {
    font-size: 11px;
  }
`;

const Share = () => {
  const { activeWeather, sideState } = useWeather();
  const reportCardRef = useRef<HTMLDivElement>(null);
  const [copyLoading, setCopyLoading] = useState<boolean>(false);
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [report, setReport] = useState<ReportType | null>(null);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

   const report_id = queryParams.get("share");

  const downloadImage = (blob: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = blob;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = async () => {
    const element = reportCardRef?.current;
    if (!element) {
      throw new Error("no element");
    }
    const data = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      skipFonts: false,
    });

    downloadImage(
      data,
      `Weather report for ${activeWeather?.place.text} on ${
        activeWeather
          ? parseDate(
              formatDateFromMs((activeWeather?.time?.dt || 0) * 1000) || "",
            )
          : "Wednesday 12th April 2025"
      } ${
        activeWeather
          ? `${formatDate((activeWeather?.time.dt || 0) * 1000).time}`
          : "12:01"
      }`,
    );
    return true;
  };

  const metricItems = [
    {
      label: "Temperature",
      unit: "DEG",
      value: report?.weather.conditions.temperature,
    },
    {
      label: "Wind Speed",
      unit: "MPH",
      value: report?.weather.conditions.speed,
    },
    {
      label: "Humidity",
      unit: "%",
      value: report?.weather.conditions.humidity,
    },
    {
      label: "Pressure",
      unit: "mPa",
      value: report?.weather.conditions.pressure,
    },
  ];

  const createReport = async () => {
    setReportLoading(true);
    const { data, error } = await tryCatch(
      axios.post(`${root_url}/places/weather/share/new`, {
        place: activeWeather?.place,
        weather: activeWeather?.weather,
        time: activeWeather?.time,
      }),
    );
    console.log(error, data);
    if (error) {
      setReportLoading(false);
      return null;
    }
    setReportLoading(false);
    setReport(data?.data?.report || null);
    return data;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  // console.log(report)

  useEffect(() => {
    if (sideState == "share" && activeWeather) {
      if (!report_id) {
        createReport();
      } else {
        setReport(activeWeather);
      }
    }
  }, [sideState, activeWeather]);
  return (
    <>
      <p className="title">SHARE</p>
      <LinkBar>
        <div className="text">
          {report && (
            <p>https://weather-me-styled.vercel.app/?share={report.report_id}</p>
          )}
        </div>
        <Clipboard
          color="#C6D5DB"
          size={14}
          onClick={() => {
            const text = `https://weather-me-styled.vercel.app/?share=${report.report_id}`;
            copyToClipboard(text)
              .then((data) => {
                toast.success("copied to clipboard");
              })
              .catch((error) => {
                toast.error("error copying to clipboard");
              });
          }}
        />
      </LinkBar>
      <p className="title">REPORT CARD PREVIEW</p>
      <div className="report-ref" ref={reportCardRef}>
        <ReportContainer>
          <div className="card-main">
            <Bottom className="report-bottom">
              {/* <div className="value">
              <h1>{activeWeather?.weather.conditions.temperature.toFixed()}</h1>
              <p>°C</p>
            </div> */}
              <div className="main">
                <h2> {report?.place.text || ""}</h2>
                <div className="date">
                  <p>
                    {report
                      ? `${formatDate((report?.time.dt || 0) * 1000).time}`
                      : ""}
                  </p>
                  <span>-</span>
                  <p>
                    {report
                      ? parseDate(
                          formatDateFromMs((report?.time?.dt || 0) * 1000) ||
                            "",
                        )
                      : ""}
                  </p>
                </div>
              </div>
              <div className="condition">
                <RenderWeatherIcon
                  group={getWeatherGroup(report?.weather.description.id || 0)}
                  //   className="text-[#e1e1e1]"
                />
                <p>
                  {" "}
                  {getWeatherGroup(report?.weather.description.id || 1000)}
                </p>
              </div>
            </Bottom>
          </div>
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
        </ReportContainer>
      </div>
      <button
        className="download-report"
        onClick={() => {
          handleDownloadImage();
        }}
      >
        <Download />
        Download Report
      </button>
    </>
  );
};
export default Share;
