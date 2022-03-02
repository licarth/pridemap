const fs = require("fs");
const { getMapJSON } = require("dotted-map");

// Or in the browser: import DottedMap from 'dotted-map';

const southWest = [32.774744, -13.36162];
const northEast = [67.191439, 51.632437];

const mapJsonString = getMapJSON({
  height: 50,
  grid: "diagonal",
  region: {
    lat: { min: southWest[0], max: northEast[0] },
    lng: { min: southWest[1], max: northEast[1] },
  },
});
fs.writeFileSync("./src/map.json", mapJsonString);
