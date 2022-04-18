import styled from "styled-components";

export const BlackLink = styled.a`
  color: white;
  :hover {
    filter: invert(1);
    background: black;
    cursor: pointer;
  }
`;

export const BlackLinkBox = styled.div`
  color: white;
  :hover {
    filter: invert(1);
    background: black;
    cursor: pointer;
  }
  font-size: larger;
  border: solid 1px white;
  border-radius: 0.5em;
  padding: 0.5em;
`;
