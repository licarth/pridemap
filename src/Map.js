import { format } from "date-fns";
import { addWeeks, endOfWeek, format as formatFp } from "date-fns/fp";
import { fr } from "date-fns/locale";
import _ from "lodash";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useMemo } from "react";
import SVG from "react-inlinesvg";
import { Circle, MapContainer, SVGOverlay, Tooltip } from "react-leaflet";
import styled from "styled-components";
import { onlyCountries } from "./computeMapSvg";
import { usePrideSelect } from "./currentWeekNumberContext";
import { getColorFromLatitude } from "./getColorFromLatitude";
import { northEast, southWest } from "./mapBoundaries";
import { formatWeekend } from "./formatWeekend";
import { SetCenterOnChange } from "./SetCenterOnChange";

const Map = () => {
  const bounds = [southWest, northEast];

  const { loading, prides, weekendNumber, setWeekendNumber } = usePrideSelect();

  const { marks } = useMemo(() => {
    const marks = _(prides)
      .groupBy("weekendNumber")
      .mapValues((v, weekendNumber) => (
        <Label>{formatWeekend(weekendNumber)}</Label>
      ))
      .value();

    return {
      marks,
    };
  }, [prides]);

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

  const markKeys = Object.keys(marks).map(Number);
  const p = currentlySelectedPrides[0];
  const center = p ? [p.pin.lat, p.pin.lng] : [51.505, 8];

  console.log(center);

  return (
    <FlexBody>
      <StyledMapContainer
        keyboard={false}
        center={center}
        zoom={zoom}
        minZoom={zoom - 1}
        maxZoom={zoom}
        zoomControl={true}
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
      {prides && (
        <SliderContainer>
          <Slider
            min={_.min(markKeys)}
            max={_.max(markKeys)}
            value={weekendNumber}
            marks={marks}
            step={1}
            onChange={(weekendNumber) => setWeekendNumber(weekendNumber)}
          />
        </SliderContainer>
      )}
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
  color: white;
  transform: rotate(-70deg) translateX(-30px);
`;

const SliderContainer = styled.div`
  &:before {
    opacity: 0.7;
  }

  position: absolute;
  width: 80vw;
  bottom: 0px;
  height: 80px;
  z-index: 1000;
  background-color: #020300;
  padding: 20px;
  margin: 30px;
  border-radius: 20px;
  color: white;
`;

const FlexBody = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
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
  margin: 30px;
  border-radius: 20px;
  color: white;
`;

const PrideDetails = styled.div`
  display: flex;
  flex-direction: column;
`;
const City = styled.h2``;
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
  transform: translateY(-50px);
  font-size: large;
  font-weight: bold;
  padding: 4px;
  padding-left: 10px;
  background-color: rgba(0, 0, 0, 0);
  border: 0px solid #000;
  color: white;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
`;

export default Map;
