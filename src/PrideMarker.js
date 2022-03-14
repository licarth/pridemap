import { CircleMarker, Tooltip, useMap } from "react-leaflet";
import styled from "styled-components";
import { usePrideSelect } from "./currentWeekNumberContext";
import { getColorFromLatitude } from "./getColorFromLatitude";
import * as L from "leaflet";

export const PrideMarker = ({ weekendNumber, pride, zoomLevel }) => {
  const {
    pin: { lat, lng },
    city,
    weekendNumber: markerWeekendNumber,
  } = pride;
  const { mode, selectedCity, selectCity } = usePrideSelect();

  const color = getColorFromLatitude(lat);
  const currentlySelected =
    mode === "weekend"
      ? weekendNumber === markerWeekendNumber
      : selectedCity === city;

  const somethingIsSelected =
    mode === "weekend" ? !!weekendNumber : !!selectedCity;
  return (
    <>
      <CircleMarker
        key={city}
        center={{ lat, lng }}
        radius={8}
        fillColor={color.main}
        eventHandlers={{
          click: (e) => {
            L.DomEvent.stopPropagation(e);
            selectCity(city);
          },
        }}
        pathOptions={{
          fillColor: somethingIsSelected
            ? currentlySelected
              ? color.highlighted
              : color.faded
            : color.main,
          fill: true,
          fillOpacity: 1,
          stroke: false,
        }}
      />
      {currentlySelected && (
        <CircleMarker
          key={`selected-marker-${city}`}
          center={{ lat, lng }}
          radius={20}
          color={color.highlighted}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e);
              selectCity(city);
            },
          }}
          pathOptions={{
            fillOpacity: 0.01,
            fill: true,
            // weight: currentlySelected ? "5" : "1",
          }}
        >
          <TooltipElement permanent offset={[20, 0]}>
            {city}
          </TooltipElement>
        </CircleMarker>
      )}
      {
        <CircleMarker
          key={`outermarker-${city}`}
          center={{ lat, lng }}
          radius={20}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e);
              selectCity(city);
            },
          }}
          pathOptions={{
            stroke: false,
            fillOpacity: 0.2,
            fill: true,
            fillColor: color.main,
          }}
        />
      }
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
