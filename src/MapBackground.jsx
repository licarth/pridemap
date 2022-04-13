import { height, width } from "./mapBoundaries";
import { SVGOverlay } from "react-leaflet";

export const MapBackground = ({ bounds }) => {
  console.log("rendering background");
  return (
    <SVGOverlay attributes={{}} bounds={bounds}>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <image href="/map.svg" width="100%" height="100%" />
      </svg>
    </SVGOverlay>
  );
};
