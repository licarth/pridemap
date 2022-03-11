import Color from "color";

const Colors = {
  RED: "#FF0018",
  ORANGE: "#FFA52C",
  YELLOW: "#FFFF41",
  GREEN: "#008018",
  BLUE: "#0000F9",
  PURPLE: "#86007D",
  WHITE: "#ffffff",
};

const faded = (hexColor) => Color(hexColor).darken(0.8).hex();
const highlighted = (hexColor) => Color(hexColor).alpha(0.5).lighten(0.1).hex();

const colorsArray = [
  {
    main: Colors.PURPLE,
    faded: faded(Colors.PURPLE),
    highlighted: highlighted(Colors.PURPLE),
    strong: Colors.WHITE,
  },
  {
    main: Colors.BLUE,
    faded: faded(Colors.BLUE),
    highlighted: highlighted(Colors.BLUE),
    strong: Colors.WHITE,
  },
  {
    main: Colors.GREEN,
    faded: faded(Colors.GREEN),
    highlighted: highlighted(Colors.GREEN),
    strong: Colors.WHITE,
  },
  {
    main: Colors.YELLOW,
    faded: faded(Colors.YELLOW),
    highlighted: highlighted(Colors.YELLOW),
    strong: Colors.WHITE,
  },
  {
    main: Colors.ORANGE,
    faded: faded(Colors.ORANGE),
    highlighted: highlighted(Colors.ORANGE),
    strong: Colors.WHITE,
  },
  {
    main: Colors.RED,
    faded: faded(Colors.RED),
    highlighted: highlighted(Colors.RED),
    strong: Colors.WHITE,
  },
];

const minLat = 36;
const maxLat = 60;

// 36 => 0
// 45 => 6

// y = (x - 36) * 6 / (45-36)

export const getColorFromLatitude = (latitude) => {
  if (latitude > maxLat) {
    return {
      main: Colors.WHITE,
      faded: faded(Colors.WHITE),
      highlighted: highlighted(Colors.WHITE),
      strong: Colors.RED,
    };
  }

  const colorsArrayIndex = Math.floor(
    ((latitude - minLat) * colorsArray.length) / (maxLat - minLat)
  );

  return colorsArray[colorsArrayIndex] || colorsArray[0];
};
