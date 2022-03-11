import { CircleMarker, Tooltip, useMap } from "react-leaflet";
import styled from "styled-components";
import { usePrideSelect } from "./currentWeekNumberContext";
import { getColorFromLatitude } from "./getColorFromLatitude";

export const PrideMarker = ({ weekendNumber, pride, zoomLevel }) => {
  const {
    pin: { lat, lng },
    city,
    weekendNumber: markerWeekendNumber,
  } = pride;
  const { setWeekendNumber } = usePrideSelect();

  const color = getColorFromLatitude(lat);
  const currentlySelected = weekendNumber === markerWeekendNumber;
  return (
    <>
      <CircleMarker
        key={city}
        center={{ lat, lng }}
        radius={8}
        color={color.strong}
        fillColor={color.main}
        fill={true}
        eventHandlers={{
          click: () => setWeekendNumber(markerWeekendNumber),
        }}
        pathOptions={{
          stroke: false,
          fillOpacity: weekendNumber && !currentlySelected ? 0.3 : 1,
        }}
      >
        {currentlySelected && <TooltipElement permanent>{city}</TooltipElement>}
      </CircleMarker>
      {currentlySelected && (
        <CircleMarker
          key={`selected-marker-${city}`}
          center={{ lat, lng }}
          radius={20}
          color={color.main}
          eventHandlers={{
            click: () => setWeekendNumber(markerWeekendNumber),
          }}
          pathOptions={{
            fillOpacity: 0.01,
            fill: true,
            fillColor: color.main,
            // weight: currentlySelected ? "5" : "1",
          }}
        />
      )}
      <CircleMarker
        key={`outermarker-${city}`}
        center={{ lat, lng }}
        radius={20}
        eventHandlers={{
          click: () => setWeekendNumber(markerWeekendNumber),
        }}
        pathOptions={{
          stroke: false,
          fillOpacity: 0.2,
          fill: true,
          fillColor: color.main,
        }}
      >
        {currentlySelected && <TooltipElement permanent>{city}</TooltipElement>}
      </CircleMarker>
    </>
  );
};

const TooltipElement = styled(Tooltip)`
  &:before {
    right: 0;
    border-color: rgba(0, 0, 0, 0);
  }
  &:before {
    left: 0;
    border-color: rgba(0, 0, 0, 0);
  }
  font-size: large;
  font-weight: bold;
  padding: 4px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: rgba(0, 0, 0, 0);
  border: 0px solid #000;
  color: white;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
`;
