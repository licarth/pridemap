import { useMap, useMapEvents } from "react-leaflet";
import { usePrideSelect } from "./currentWeekNumberContext";

export function SetCenterOnChange({ coords }) {
  const map = useMap();

  const { setWeekendNumber } = usePrideSelect();
  useMapEvents({
    click() {
      setWeekendNumber(null);
    },
  });

  map.setView(coords, map.getZoom());

  return null;
}
