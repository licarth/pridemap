const Colors = {
  RED: "#FF0018",
  ORANGE: "#FFA52C",
  YELLOW: "#FFFF41",
  GREEN: "#008018",
  BLUE: "#0000F9",
  PURPLE: "#86007D",
};
const colorsArray = [
  Colors.PURPLE,
  Colors.BLUE,
  Colors.GREEN,
  Colors.YELLOW,
  Colors.ORANGE,
  Colors.RED,
];

const minLat = 36;
const maxLat = 60;

// 36 => 0
// 45 => 6

// y = (x - 36) * 6 / (45-36)

export const getColorFromLatitude = (latitude) => {
  if (latitude > maxLat) {
    return "white";
  }

  const colorsArrayIndex = Math.floor(
    ((latitude - minLat) * colorsArray.length) / (maxLat - minLat)
  );

  return colorsArray[colorsArrayIndex] || colorsArray[0];
};
