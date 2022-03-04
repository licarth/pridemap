const fs = require("fs");
const { getMapJSON } = require("dotted-map");

// Or in the browser: import DottedMap from 'dotted-map';

const southWest = [15, -35];
const northEast = [75, 80];

const mapJsonString = getMapJSON({
  height: 150,
  grid: "diagonal",
  region: {
    lat: { min: southWest[0], max: northEast[0] },
    lng: { min: southWest[1], max: northEast[1] },
  },
});
fs.writeFileSync("./src/map.json", mapJsonString);
fs.writeFileSync(
  "./src/mapBoundaries.js",
  ` // This file is auto-generated, please do not edit it.
export const southWest = ${JSON.stringify(southWest)};
export const northEast = ${JSON.stringify(northEast)};
`
);
