const fs = require("fs");
const { getMapJSON } = require("dotted-map");
const DottedMap = require("dotted-map").default;

// Or in the browser: import DottedMap from 'dotted-map';

const southWest = [20, -35];
const northEast = [72, 80];

const mapParams = {
  height: 100,
  grid: "diagonal",
  region: {
    lat: { min: southWest[0], max: northEast[0] },
    lng: { min: southWest[1], max: northEast[1] },
  },
};

const mapJsonString = getMapJSON(mapParams);

const map = new DottedMap(mapParams);
const mapSvgString = map.getSVG({
  radius: 0.22,
  color: "#665b57",
  shape: "circle",
});
const mapPoints = JSON.stringify(map.getPoints().map((p) => [p.x, p.y]));

fs.writeFileSync("./src/map.json", mapJsonString);
fs.writeFileSync("./src/map.svg", mapSvgString);
fs.writeFileSync("./src/points.json", mapPoints);
fs.writeFileSync(
  "./src/mapBoundaries.js",
  ` // This file is auto-generated, please do not edit it.
export const southWest = ${JSON.stringify(southWest)};
export const northEast = ${JSON.stringify(northEast)};
export const width = ${JSON.stringify(map.image.width)};
export const height = ${JSON.stringify(map.image.height)};
`
);
