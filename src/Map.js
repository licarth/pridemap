import { useState } from "react";
import SVG from "react-inlinesvg";
import { Circle, MapContainer, SVGOverlay, Tooltip } from "react-leaflet";
import styled from "styled-components";
import useGoogleSheets from "use-google-sheets";
import { circles } from "./circles";
import { onlyCountries } from "./computeMapSvg";
import { getColorFromLatitude } from "./getColorFromLatitude";

const getXYFromLatLng = ({ point }) => {};

const Map = () => {
  const position = [51.505, 8];
  const southWest = [32.774744, -13.36162];
  const northEast = [67.191439, 51.632437];
  const bounds = [southWest, northEast];

  const [displayCities, setDisplayCities] = useState(false);

  const { data, loading, error } = useGoogleSheets({
    // apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: "1P7xHRf4C7Gh6HBc1FdJbdxO73UqgM-_TbAm6341SutI",
  });

  const zoom = 5;

  return (
    <FlexBody>
      <CenterColumn>
        <StyledMapContainer
          center={position}
          zoom={zoom}
          minZoom={zoom}
          maxZoom={zoom}
          zoomControl={false}
        >
          <SVGOverlay attributes={{}} bounds={bounds}>
            <Layer
              src={`data:image/svg+xml;utf8,${encodeURIComponent(
                onlyCountries
              )}`}
            />
            {circles.map((c) => (
              <>
                <SVGOverlay attributes={{}} bounds={[c, c]}>
                  <svg viewBox="0 0 100 100">
                    <text fill="white" x={c.lng} y={c.lat} class="small">
                      TOTO
                    </text>
                  </svg>
                </SVGOverlay>
              </>
            ))}
          </SVGOverlay>
          {circles.map((c) => {
            const color = getColorFromLatitude(c.lat);
            return (
              <>
                <Circle
                  center={{ lat: c.lat, lng: c.lng }}
                  radius={20000}
                  color={color}
                  fillColor={color}
                  fill="true"
                  fillOpacity="1"
                >
                  {" "}
                  <Tooltip>toto</Tooltip>
                </Circle>
              </>
            );
          })}
        </StyledMapContainer>
        <ListContainer>
          <label for="display-cities">
            <input
              type="checkbox"
              id="display-cities"
              checked={displayCities}
              onChange={(e) => setDisplayCities(e.target.checked)}
            />
            Display Cities
          </label>
        </ListContainer>
      </CenterColumn>
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

const TextNearPoint = styled.span`
  position: absolute;
  top: calc(${({ $y }) => $y} - 2px);
  left: calc(${({ $x }) => $x} + 16px);
  font-weight: bold;
  color: white;
`;

const StyledMapContainer = styled(MapContainer)`
  padding: 0;
  margin: 0;
  width: 80vw;
  height: 100%;
  overflow: scroll;
  outline: 0;
  background-color: rgba(255, 0, 0, 0);
`;

const Layers = styled.div`
  position: relative;
  width: 100%;
  object-fit: cover;
  padding: 0;
  margin: 0;
`;

const ListContainer = styled.div`
  position: relative;
  height: 100%;
  width: 300px;
  min-width: 100px;
  background-color: #020300;
  padding: 20 px;
  color: white;
`;

const CenterColumn = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1400px;
  width: 100vw;
`;

const FlexBody = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #020300;
`;

export default Map;
