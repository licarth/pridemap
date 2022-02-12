import SVG from "react-inlinesvg";
import styled from "styled-components";
import { Cities } from "./cities";
import { map, onlyCities, onlyCountries } from "./computeMapSvg";

const getXYFromLatLng = ({ point }) => {
  const { height, width } = map.image;

  const originX = `max(0px, calc(0.5 * (100vh * ${width} / ${height} - 100vw)))`;
  const originY = `max(0px, calc(0.5 * (100vw * ${height} / ${width} - 100vh)))`;

  const $x = `calc(max(100vw * ${point[0]} / ${width}, 100vh * ${point[0]} / ${height}) - ${originX})`;
  const $y = `calc(max(100vw * ${point[1]} / ${width}, 100vh * ${point[1]} / ${height}) - ${originY})`;

  return { $x, $y };
};

const Map = () => {
  const latLng = getXYFromLatLng({
    point: Cities.find(([name]) => name === "Paris")[1],
  });
  return (
    <FlexBody>
      <CenterColumn>
        <MapContainer>
          <Layers>
            <Layer
              src={`data:image/svg+xml;utf8,${encodeURIComponent(
                onlyCountries
              )}`}
            />
            <Layer
              src={`data:image/svg+xml;utf8,${encodeURIComponent(onlyCities)}`}
            />
            <TextNearPoint {...latLng}>Paris</TextNearPoint>
          </Layers>
        </MapContainer>
        <ListContainer>Hello list</ListContainer>
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

const MapContainer = styled.div`
  padding: 0;
  margin: 0;
  width: 80vw;
  overflow: scroll;
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
  background-color: #1b0025;
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
