import styled from "styled-components";
import { ReactComponent as LoadingImage } from "./loader.svg";

export const Loader = () => (
  <LoaderContainer>
    <LoadingText>Please be patient,</LoadingText>
    <LoadingText>data is proudly being loaded...</LoadingText>
    <StyledLoader />
  </LoaderContainer>
);

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: #020300;
`;

const LoadingText = styled.div`
  color: white;
  font-weight: 300;
  font-size: large;
  margin-bottom: 5px;
`;

const StyledLoader = styled(LoadingImage)`
  margin-top: 40px;
  height: 100px;
  width: 100px;
`;
