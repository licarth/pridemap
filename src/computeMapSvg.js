import DottedMap from "dotted-map/without-countries";
import JsonMap from "./map.json";

export const map = new DottedMap({ map: JsonMap });
export const onlyCountries = map.getSVG({
  radius: 0.22,
  color: "#423B38",
  shape: "circle",
});
