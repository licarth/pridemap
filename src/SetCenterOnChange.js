import { useMap } from "react-leaflet";

export function SetCenterOnChange({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());

  return null;
}
