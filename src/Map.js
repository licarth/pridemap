import * as turf from "@turf/turf";
import { format, getDay } from "date-fns";
import _ from "lodash";
import "rc-slider/assets/index.css";
import { useMemo } from "react";
import SVG from "react-inlinesvg";
import { MapContainer, SVGOverlay } from "react-leaflet";
import styled from "styled-components";
import { onlyCountries } from "./computeMapSvg";
import { usePrideSelect } from "./currentWeekNumberContext";
import { northEast, southWest } from "./mapBoundaries";
import { PrideMarker } from "./PrideMarker";
import { SetCenterOnChange } from "./SetCenterOnChange";
import { Timeline } from "./Timeline/Timeline";

const Map = () => {
  const bounds = [southWest, northEast];

  const { loading, prides, weekendNumber, previewedWeekendNumber } =
    usePrideSelect();

  const thisWeekendNumber = previewedWeekendNumber || weekendNumber;

  const pridesPerWeekendNumber = useMemo(
    () => _(prides).groupBy("weekendNumber").value(),
    [prides]
  );

  const currentlySelectedPrides = useMemo(
    () =>
      prides &&
      prides.filter(({ weekendNumber: w }) => w === thisWeekendNumber),
    [thisWeekendNumber, prides]
  );

  const zoom = useMemo(() => (window.innerWidth < 1000 ? 4 : 5), []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const DEFAULT_CENTER = [51.505, 8];
  const center =
    currentlySelectedPrides?.length > 0
      ? turf.centerOfMass(
          turf.points(
            currentlySelectedPrides.map(({ pin }) => [pin.lat, pin.lng])
          )
        )?.geometry?.coordinates
      : DEFAULT_CENTER;

  return (
    <FlexBody>
      <StyledMapContainer
        keyboard={false}
        center={center}
        zoom={zoom}
        minZoom={zoom - 2}
        maxZoom={zoom}
        zoomControl={false}
        dragging={true}
        maxBounds={bounds}
      >
        <SetCenterOnChange coords={center} />
        <SVGOverlay attributes={{}} bounds={bounds}>
          <Layer
            src={`data:image/svg+xml;utf8,${encodeURIComponent(onlyCountries)}`}
          />
        </SVGOverlay>
        {prides &&
          prides.map((pride) => (
            <PrideMarker weekendNumber={thisWeekendNumber} pride={pride} />
          ))}
      </StyledMapContainer>
      <RightColumn>
        {currentlySelectedPrides &&
          _(currentlySelectedPrides)
            .groupBy(({ paradeStartDate }) => getDay(paradeStartDate))
            .mapKeys((v, i) => (i === "0" ? "7" : i))
            .entries()
            .sortBy(([a]) => a)
            .map(([paradeStartDate, prides]) => (
              <PrideBlock>
                <DayHeading>
                  {prides[0]?.paradeStartDate
                    ? format(prides[0].paradeStartDate, "EEE, MMMM do")
                    : "To be announced"}
                </DayHeading>
                {prides.map(({ city }) => (
                  <CityName key={`citylabel-${city}`}>{city}</CityName>
                ))}
              </PrideBlock>
            ))
            .value()}
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

const SliderContainer = styled.div`
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
  border-radius: 20px;
  color: white;
  background-color: black;
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
  display: flex;
  justify-content: space-between;
  width: 40em;
  max-width: 95vw;
  z-index: 1000;
  padding: 20px;
  margin: 3px;
  border-radius: 20px;
  color: white;
  max-height: 30vh;
  overflow: scroll;
  background: rgba(2, 3, 0, 0.7);
`;

const CityName = styled.div`
  display: flex;
  flex-direction: column;
`;
const DayHeading = styled.h3``;
const PrideBlock = styled.div``;

export default Map;
