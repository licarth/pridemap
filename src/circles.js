import { Cities } from "./cities";
import { map, onlyCountries } from "./computeMapSvg";

const Colors = {
  RED: "#FF0018",
  ORANGE: "#FFA52C",
  YELLOW: "#FFFF41",
  GREEN: "#008018",
  BLUE: "#0000F9",
  PURPLE: "#86007D",
};

const prides = [
  [
    "Paris",
    [48.858396, 2.342905],
    Colors.YELLOW,
    "10-12/06/2022",
    "11/06/2022",
  ],
  [
    "Berlin",
    [52.492175, 13.409508],
    Colors.BLUE,
    "10-12/06/2022",
    "11/06/2022",
  ],
  ["Berlin", [56, 12], Colors.RED, "10-12/06/2022", "11/06/2022"],
  ["Berlin", [43, 17], Colors.ORANGE, "10-12/06/2022", "11/06/2022"],
  ["Berlin", [45, 10], Colors.PURPLE, "10-12/06/2022", "11/06/2022"],
  ["Berlin", [44, 10], Colors.GREEN, "10-12/06/2022", "11/06/2022"],
  ...Cities.map(([name, latlng]) => [name, latlng, Colors.RED, "", ""]),
];

export const circles = prides.map(([name, coords, color, dates, paradeDate]) =>
  map.getPin({
    lat: coords[0],
    lng: coords[1],
    svgOptions: { color, radius: 0.4 },
  })
);
