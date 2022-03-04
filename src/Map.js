import { format } from "date-fns";
import { fr } from "date-fns/locale";
import _ from "lodash";
import "rc-slider/assets/index.css";
import { useMemo } from "react";
import SVG from "react-inlinesvg";
import { Circle, MapContainer, SVGOverlay, Tooltip } from "react-leaflet";
import styled from "styled-components";
import { onlyCountries } from "./computeMapSvg";
import { usePrideSelect } from "./currentWeekNumberContext";
import { getColorFromLatitude } from "./getColorFromLatitude";
import { northEast, southWest } from "./mapBoundaries";
import { SetCenterOnChange } from "./SetCenterOnChange";
import { Timeline } from "./Timeline/Timeline";

const Map = () => {
  const bounds = [southWest, northEast];

  const { loading, prides, weekendNumber, setWeekendNumber } = usePrideSelect();

  const pridesPerWeekendNumber = useMemo(
    () => _(prides).groupBy("weekendNumber").value(),
    [prides]
  );

  const currentlySelectedPrides = useMemo(
    () =>
      prides && prides.filter(({ weekendNumber: w }) => w === weekendNumber),
    [weekendNumber, prides]
  );

  const zoom = useMemo(
    () => (window.innerWidth < 1000 ? 4 : 5),
    [window.innerWidth]
  );

  if (loading) {
    return <div>Loading</div>;
  }

  const p = currentlySelectedPrides[0];
  const center = p ? [p.pin.lat, p.pin.lng] : [51.505, 8];

  console.log(center);

  return (
    <FlexBody>
      <StyledMapContainer
        keyboard={false}
        center={center}
        zoom={zoom}
        minZoom={zoom}
        maxZoom={zoom}
        zoomControl={false}
        dragging={false}
        maxBounds={bounds}
      >
        <SetCenterOnChange coords={center} />
        <SVGOverlay attributes={{}} bounds={bounds}>
          <Layer
            src={`data:image/svg+xml;utf8,${encodeURIComponent(onlyCountries)}`}
          />
          {prides &&
            prides.map(({ pin }) => (
              <>
                <SVGOverlay attributes={{}} bounds={[pin, pin]}>
                  <svg viewBox="0 0 100 100">
                    <text fill="white" x={pin.lng} y={pin.lat} class="small">
                      TOTO
                    </text>
                  </svg>
                </SVGOverlay>
              </>
            ))}
        </SVGOverlay>
        {prides &&
          prides.map(
            ({
              pin: { lat, lng },
              city,
              weekendNumber: currentWeekendNumber,
            }) => {
              const color = getColorFromLatitude(lat);
              const currentlySelected = weekendNumber === currentWeekendNumber;
              return (
                <>
                  <Circle
                    center={{ lat, lng }}
                    radius={20000}
                    color={color}
                    fillColor={color}
                    fill={true}
                    pathOptions={{
                      stroke: currentlySelected,
                      fillOpacity: currentlySelected ? "1" : "0.6",
                      weight: currentlySelected ? "5" : "1",
                    }}
                  >
                    {currentlySelected && (
                      <TooltipElement permanent>{city}</TooltipElement>
                    )}
                  </Circle>
                </>
              );
            }
          )}
      </StyledMapContainer>
      <RightColumn>
        {currentlySelectedPrides &&
          currentlySelectedPrides.map(({ city, paradeStartDate }) => (
            <PrideDetails key={city}>
              <City>{city}</City>
              <ParadeDate>
                {paradeStartDate &&
                  format(paradeStartDate, "EEE d MMMM", { locale: fr })}
              </ParadeDate>
            </PrideDetails>
          ))}
      </RightColumn>
      {
        <SliderContainer>
          <Timeline pridesPerWeekendNumber={pridesPerWeekendNumber} />
        </SliderContainer>
      }
    </FlexBody>
  );
};

const Layer = styled(SVG)`
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;

  circle {
    :hover {
      r: 0.7;
      padding: 100px;
      border: solid black;
    }
  }
`;

const StyledMapContainer = styled(MapContainer)`
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  outline: 0;
  background-color: rgba(255, 0, 0, 0);
`;

const Label = styled.div`
  max-width: 100px;
  transform: rotate(-70deg) translateX(-30px);
`;

const SliderContainer = styled.div`
  &:before {
    opacity: 0.7;
  }

  position: absolute;

  @media (max-width: 480px) {
    & {
      width: 300px;
    }
  }

  @media (min-width: 480px) {
    & {
      width: 400px;
    }
  }

  @media (min-width: 768px) {
    & {
      width: 500px;
    }
  }

  @media (min-width: 1024px) {
    & {
      width: 900px;
    }
  }

  bottom: 0px;
  height: 80px;
  z-index: 1000;
  padding: 10px;
  background-color: #020300;
  border-radius: 20px;
  color: white;
`;

const FlexBody = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #020300;
`;

const RightColumn = styled.div`
  position: absolute;
  right: 0;
  width: 200px;
  z-index: 1000;
  background-color: #020300;
  padding: 20px;
  margin: 3px;
  border-radius: 20px;
  color: white;
  max-height: 30vh;
  overflow-y: scroll;
`;

const PrideDetails = styled.div`
  display: flex;
  flex-direction: column;
`;
const City = styled.h3``;
const ParadeDate = styled.div``;
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
`;

export default Map;
