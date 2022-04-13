import { useMap, useMapEvents } from "react-leaflet";
import { usePrideSelect } from "./currentWeekNumberContext";
import * as L from "leaflet";
import * as turf from "@turf/turf";

export default function SetCenterOnChange({
  coords,
  mode,
  weekendNumber,
  selectWeekend,
  selectedPride,
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

  const prides =
    mode === "weekend" && currentlySelectedPrides.length > 0
      ? currentlySelectedPrides
      : selectedPride
      ? [selectedPride]
      : [];

  if (prides.length > 0) {
    const boundsForCurrentlySelectedPrides = turf.bbox(
      turf.points(prides.map(({ pin }) => [pin.lat, pin.lng]))
    );
    const [minLat, minLng, maxLat, maxLng] = boundsForCurrentlySelectedPrides;
    // Make it 30% bigger on the bottom
    // const newMinLat = minLat - (maxLat - minLat) * 0.5;
    const height = turf.distance(
      turf.point([minLng, minLat]),
      turf.point([minLng, maxLat])
    );
    const newHeight = height * 1.8;
    const newMinLat = turf.rhumbDestination(
      turf.point([maxLng, maxLat]),
      newHeight,
      180
    ).geometry.coordinates[1];

    map.fitBounds(
      [
        [newMinLat, minLng],
        [maxLat, maxLng],
      ],
      { animate: false, maxZoom: 4 }
    );
  } else {
    map.setView(coords, map.getZoom());
  }

  return null;
}
