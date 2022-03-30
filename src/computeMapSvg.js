import DottedMap from "dotted-map/without-countries";
import JsonMap from "./map.json";

export const map = new DottedMap({ map: JsonMap });
