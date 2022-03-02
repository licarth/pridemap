import DottedMap from "dotted-map/without-countries";
import JsonMap from "./map.json";
const { Cities } = require("./cities");

export const map = new DottedMap({ map: JsonMap });
export const onlyCountries = map.getSVG({
  radius: 0.22,
  color: "#423B38",
  shape: "circle",
});

// export const onlyCities = map.getSVG({
//   radius: 0,
//   shape: "circle",
// });
