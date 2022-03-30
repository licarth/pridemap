import { useMap, useMapEvents } from "react-leaflet";
import { usePrideSelect } from "./currentWeekNumberContext";
import * as L from "leaflet";
import * as turf from "@turf/turf";

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

  if (mode === "weekend" && currentlySelectedPrides.length > 0) {
    const boundsForCurrentlySelectedPrides = turf.bbox(
      turf.points(currentlySelectedPrides.map(({ pin }) => [pin.lat, pin.lng]))
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
    console.log("minLat: " + minLat);
    console.log("newMinLat: " + newMinLat);

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
