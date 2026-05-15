import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  useWeather,
  type Place,
  type SearchResult,
} from "../utils/stores/weather_store";
import { root_url } from "../App";
import axios from "axios";
import { tryCatch } from "../utils/tryCatch";
import Skeleton from "./skeleton";
import { loadWeather } from "../utils/load_weather";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SearchBar = styled.form`
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
  }
  input {
    flex: 1;
    outline: none;
    border: none;
    color: #c6d5db;
    background: none;
  }
`;

const SearchList = styled.div`
  width: 100%;
  flex: 1;
  background: #1c262b;
  border: 1px solid #304247;
  margin-top: 15px;
  border-radius: 10px;
  overflow-x: hidden;
  padding: 0px 10px;
  .card {
    width: 100%;
    margin: 10px 0px;
    height: 57px;
    display: flex;
    align-items: center;
    padding: 0px 10px;
    cursor: pointer;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .card:hover {
    background-color: #223036;
    border: 1px solid #304247;
  }
  .text {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    overflow: hidden;
    justify-content: center;
  }
  p.city {
    font-size: 15px;
    color: #c6d5db;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  p.country {
    font-size: 11px;
    color: #8ea3ab;
    white-space: nowrap;
  }
  .loader-skeleton {
    width: 100%;
    border-radius: 8px;
    margin: 10px 0px;
    height: 57px;
  }
  .no_search {
    color: #c6d5db;
    margin-top: 20px;
  }
`;

const removeLastPart = (str: string) => {
  if (!str) return "";

  return str
    .split(",") // Split into array by comma
    .slice(0, -1) // Remove the last item
    .join(",") // Join back into a string
    .trim(); // Clean up any trailing whitespace
};

const keepOnlyLastPart = (str: string) => {
  if (!str) return "";

  const parts = str.split(",");
  return parts[parts.length - 1].trim();
};

const getSearchHistory = (): SearchResult[] =>
  (
    JSON.parse(localStorage.getItem("searches") ?? "[]") as SearchResult[]
  ).reverse();

const Search = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [searchLoadung, setSearchLoadung] = useState<boolean>(false);
  const [searchList, setSearchList] =
    useState<SearchResult[]>(getSearchHistory());
  const [searchError, setSearchError] = useState<string>("");
  const [cityLoading, setCityLoading] = useState<string | null>(null);
  const {
    activeWeather,
    setActiveWeather,
    setActiveWeatherLoading,
    setActiveWeatherError,
    sideState,
    setSideState,
  } = useWeather();

    const navigate = useNavigate();

  const searchPlaces = async () => {
    const { data, error } = await tryCatch(
      axios.get(`${root_url}/places/search?input=${search}`),
    );
    if (error) {
      throw error;
    }
    console.log(data);
    return data.data.results.map((data: Place) => ({
      ...data,
      type: "live",
    }));
  };

  console.log(searchList);

  useEffect(() => {
    if (search) {
      searchPlaces()
        .then((data: SearchResult[]) => {
          console.log(data);
          setSearchList(
            data.filter(function (el) {
              return el.text && el.text?.split(",").length > 1;
            }),
          );
          setSearchLoadung(false);
        })
        .catch((error) => {
            toast.error("unable to search for cities!");
        });
    }
  }, [search]);
  return (
    <>
      <p className="title">SEARCH</p>
      <SearchBar
        onSubmit={(e) => {
          e.preventDefault();

          if (e.target.search.value.trim()) {
            setSearch(e.target.search.value);
            setSearchLoadung(true);
          } else {
            setSearch("");
          }
        }}
      >
        <SearchIcon color="#C6D5DB" size={15} />
        <input
          type="text"
          name="search"
          placeholder="Search cities"
          value={searchText}
          onChange={(e) => {
            if (!e.target.value) {
              setSearchList(getSearchHistory());
            }
            setSearchText(e.target.value);
          }}
        />
      </SearchBar>
      <>
        {searchLoadung ? (
          <SearchList>
            {["", "", "", "", "", ""].map((item, idx) => (
              <Skeleton key={idx} className="loader-skeleton" />
            ))}
          </SearchList>
        ) : (
          <SearchList>
            {searchList.length > 0 ? (
              <>
                {searchList.map((item, idx) => (
                  <div
                    className="card"
                    key={item.place_id ?? idx}
                    onClick={() => {
                        navigate("/");
                      const searchHistory = JSON.parse(
                        localStorage.getItem("searches") ?? "[]",
                      ) as SearchResult[];

                      const nextHistory: SearchResult[] = [
                        ...searchHistory.filter(
                          (historyItem) =>
                            historyItem.place_id !== item.place_id,
                        ),
                        {
                          ...item,
                          type: "history",
                        },
                      ];

                      localStorage.setItem(
                        "searches",
                        JSON.stringify(nextHistory),
                      );
                      setSearchList(nextHistory.slice().reverse());
                      setActiveWeatherLoading(true);
                      setCityLoading(item.place_id);
                      loadWeather(
                        item.place_id,
                        removeLastPart(item.text || ""),
                      )
                        .then((data) => {
                          setActiveWeather(data);
                          setCityLoading(null);
                          setSideState("details");
                        })
                        .catch((error) => {
                          setCityLoading(null);
                          setActiveWeatherError(error);
                          // console.log(error)
                        });
                    }}
                  >
                    {item.type == "live" ? (
                      <MapPin color="#C6D5DB" size={20} />
                    ) : (
                      <Clock color="#C6D5DB" size={20} />
                    )}

                    <div className="text">
                      <p className="city">{removeLastPart(item.text || "")}</p>
                      <p className="country">
                        {keepOnlyLastPart(item.text || "")}
                      </p>
                    </div>
                    {cityLoading != item.place_id ? (
                      <ChevronRight color="#C6D5DB" size={20} />
                    ) : (
                      <ClipLoader color="#C6D5DB" size={20} />
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {search && searchText ? (
                  <p className="no_search">No cities found</p>
                ) : (
                  <p className="no_search">No recent search history</p>
                )}
              </>
            )}
          </SearchList>
        )}
      </>
    </>
  );
};

export default Search;
