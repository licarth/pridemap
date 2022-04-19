import { format, getDay } from "date-fns";
import _ from "lodash";
import "rc-slider/assets/index.css";
import React, { Suspense, useEffect, useMemo } from "react";
import { LayerGroup, MapContainer } from "react-leaflet";
import styled from "styled-components";
import { BlackLink } from "./BlackLink";
import { usePrideSelect } from "./currentWeekNumberContext";
import { formatWeekend } from "./formatWeekend";
import { getFlagEmoji } from "./getFlagEmoji";
import { Loader } from "./Loader";
import { MapBackground } from "./MapBackground";
import { northEast, southWest } from "./mapBoundaries";
import { PrideMarker } from "./PrideMarker";
import { SinglePrideIntro } from "./SinglePrideIntro";
import { Timeline } from "./Timeline/Timeline";

const SetCenterOnChange = React.lazy(() => import("./SetCenterOnChange"));

const Map = () => {
  const bounds = [southWest, northEast];

  const {
    loading,
    prides,
    weekendNumber,
    previewedWeekendNumber,
    mode,
    selectedPride,
    selectCity,
    selectWeekend,
    selectedCity,
    resetSelection,
    previousWeekend,
    nextWeekend,
  } = usePrideSelect();

  const thisWeekendNumber = previewedWeekendNumber || weekendNumber;

  const pridesPerWeekendNumber = useMemo(
    () => _(prides).groupBy("weekendNumber").value(),
    [prides]
  );

  useEffect(() => {
    if (mode) {
      function handleKeyDown(e) {
        if (e.keyCode === 27) {
          // Escape
          resetSelection();
        } else if (e.keyCode === 37) {
          // Left arrow
          previousWeekend();
        } else if (e.keyCode === 39) {
          // Right arrow
          nextWeekend();
        }
      }

      document.addEventListener("keydown", handleKeyDown);

      return function cleanup() {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mode, nextWeekend, previousWeekend, resetSelection]);

  const currentlySelectedPrides = useMemo(
    () =>
      prides &&
      prides.filter(({ weekendNumber: w }) => w === thisWeekendNumber),
    [thisWeekendNumber, prides]
  );

  const zoom = useMemo(() => (window.innerWidth < 1000 ? 4 : 4), []);

  if (loading) {
    return <Loader />;
  }

  const DEFAULT_CENTER = [47, 8];
  const center = DEFAULT_CENTER;

  const [unselectedPrides, selectedPrides] =
    prides &&
    _.partition(prides, ({ weekendNumber, city }) =>
      isCurrentlySelected(
        mode,
        thisWeekendNumber,
        weekendNumber,
        selectedCity,
        city
      )
    );

  return (
    <FlexBody>
      <StyledMapContainer
        keyboard={false}
        center={center}
        zoom={zoom}
        minZoom={zoom - 1}
        maxZoom={zoom + 1}
        zoomControl={false}
        dragging={true}
      >
        <Suspense fallback={<></>}>
          <SetCenterOnChange
            coords={center}
            mode={mode}
            weekendNumber={weekendNumber}
            selectWeekend={selectWeekend}
            currentlySelectedPrides={currentlySelectedPrides}
            selectedPride={selectedPride}
          />
        </Suspense>
        <MapBackground bounds={bounds} />
        <LayerGroup>
          {/* Selected Prides */}
          {selectedPrides &&
            selectedPrides.map((pride) => (
              <PrideMarker weekendNumber={thisWeekendNumber} pride={pride} />
            ))}
        </LayerGroup>
        <LayerGroup>
          {/* Selected Prides */}
          {unselectedPrides &&
            unselectedPrides.map((pride) => (
              <PrideMarker weekendNumber={thisWeekendNumber} pride={pride} />
            ))}
        </LayerGroup>
      </StyledMapContainer>
      {mode === "city" && (
        <TopFrame>
          <SinglePrideIntro
            pride={selectedPride}
            resetSelection={resetSelection}
          />
        </TopFrame>
      )}
      {
        <>
          {weekendNumber && (
            <BottomContainer>
              <BottomCityListContainer>
                {mode === "city" && (
                  <Header>
                    On the same weekend...{" "}
                    <BlackLink onClick={() => selectWeekend(weekendNumber)}>
                      View all on map ({formatWeekend(weekendNumber)})
                    </BlackLink>
                  </Header>
                )}
                {
                  <CityList>
                    {_(currentlySelectedPrides)
                      .groupBy(({ paradeStartDate }) => getDay(paradeStartDate))
                      .mapKeys((v, i) => (i === "0" ? "7" : i))
                      .entries()
                      .sortBy(([a]) => a)
                      .map(([paradeStartDate, prides]) => (
                        <PrideBlock>
                          <DayHeading>
                            {prides[0]?.paradeStartDate
                              ? format(
                                  prides[0].paradeStartDate,
                                  "EEE, MMMM do"
                                )
                              : "N/A"}
                          </DayHeading>
                          <CitiesList>
                            {prides.map(({ city, country }) => (
                              <CityName key={`citylabel-${city}`}>
                                <BlackLink onClick={() => selectCity(city)}>
                                  {selectedPride &&
                                  selectedPride.city === city ? (
                                    <u>{city}</u>
                                  ) : (
                                    city
                                  )}
                                </BlackLink>
                                {" " + getFlagEmoji(country)}
                              </CityName>
                            ))}
                          </CitiesList>
                        </PrideBlock>
                      ))
                      .value()}
                  </CityList>
                }
              </BottomCityListContainer>
              {mode === "city" || (
                <SliderContainer>
                  <Timeline pridesPerWeekendNumber={pridesPerWeekendNumber} />
                </SliderContainer>
              )}
            </BottomContainer>
          )}
        </>
      }
    </FlexBody>
  );
};

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
  background: black;
  min-width: 300px;

  @media (max-width: 480px) {
    & {
      width: 100%;
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
`;

const FlexBody = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #020300;
`;

const CitiesList = styled.div`
  max-height: 10vh;
  overflow-y: scroll;
`;

const TopFrame = styled.div`
  position: absolute;
  display: flex;
  width: 480px;
  max-width: 100%;
  z-index: 1000;
  color: white;
  overflow: scroll;
  background: rgba(2, 3, 0, 0.7);
  padding-bottom: 10px;

  @media (max-width: 480px) {
    margin: 0px;
    width: 100%;
    height: 100%;
  }
`;

const BottomCityListContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const BottomContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 20px;
  z-index: 1000;
  color: white;
  max-height: 30vh;
  overflow: scroll;
  background: rgba(2, 3, 0, 0.7);

  @media (min-width: 480px) {
    width: 700px;
    padding: 30px;
    font-size: 1.3em;
  }

  @media (max-width: 480px) {
    margin: 0px;
    border-radius: 0px;
    width: 100%;
    border-radius: 0px;
    bottom: 0px;
  }
`;

const CityList = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Header = styled.span`
  flex: 0 0 100%;
  padding-left: 20px;
  padding-top: 5px;
`;

const CityName = styled.div``;
const DayHeading = styled.h3`
  margin-bottom: 0;
  margin-top: 0;
`;
const PrideBlock = styled.div`
  margin-bottom: 10px;
  margin-top: 10px;
`;

export default Map;

function isCurrentlySelected(
  mode,
  weekendNumber,
  markerWeekendNumber,
  selectedCity,
  city
) {
  return mode === "weekend"
    ? weekendNumber === markerWeekendNumber
    : selectedCity === city;
}
