import { useMap, useMapEvents } from "react-leaflet";
import { usePrideSelect } from "./currentWeekNumberContext";
import * as L from "leaflet";

export function SetCenterOnChange({
  coords,
  mode,
  weekendNumber,
  selectWeekend,
  currentlySelectedPrides,
}) {
  const map = useMap();

  const { resetSelection } = usePrideSelect();
  useMapEvents({
    click: (e) => {
      L.DomEvent.stopPropagation(e);
      resetSelection();
    },
  });

  map.setView(coords, map.getZoom());

  return null;
}
