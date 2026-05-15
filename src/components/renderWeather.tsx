import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cloudy,
} from "lucide-react";
// import type { WeatherGroup } from "../../utils/stores/weather_store";
import type { WeatherGroup } from "../utils/stores/weather_store";

const RenderWeatherIcon = ({
  group,
  className,
}: {
  group: WeatherGroup;
  className?: string;
}) => {
  if (group == "Atmosphere") {
    return <CloudSnow color="#e4e4e4" size={35} />;
  }
  if (group == "Clear") {
    return <Cloud color="#e4e4e4" size={35} />;
  }
  if (group == "Clouds") {
    return <Cloudy color="#e4e4e4" size={35} />;
  }
  if (group == "Drizzle") {
    return <CloudRain color="#e4e4e4" size={35} />;
  }
  if (group == "Rain") {
    return <CloudRain color="#e4e4e4" size={35} />;
  }
  if (group == "Thunderstorm") {
    return <CloudLightning color="#e4e4e4" size={35} />;
  }
  if(group == "Snow"){
     return <CloudSnow color="#e4e4e4" size={35} />;
  }
  if (group == "Unknown") {
    return <Cloud color="#e4e4e4" size={35} />;
  }
  if (!group) {
    return <Cloud color="#e4e4e4" size={35} />;
  }
};

export default RenderWeatherIcon