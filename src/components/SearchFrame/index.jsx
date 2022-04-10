import styled from "styled-components";
import { usePrideSelect } from "../../currentWeekNumberContext";
import { SearchBar } from "../SearchBar";
import { useState } from "react";
import { SearchResults } from "./SearchResults";
import { formatWeekend } from "../../formatWeekend";
import Fuse from "fuse.js";

export const SearchFrame = () => {
  const { prides, mode } = usePrideSelect();

  const richPrides = prides
    ? prides.map((pride) => ({
        ...pride,
        weekendSearch: formatWeekend(pride.weekendNumber),
      }))
    : [];

  const [searchTerm, setSearchTerm] = useState("");

  const cityResults = new Fuse(prides, {
    includeMatches: true,
    keys: ["city"],
    threshold: 0.5,
  }).search(searchTerm);

  const weekendResults = new Fuse(richPrides, {
    includeMatches: true,
    keys: ["weekendSearch"],
    threshold: 0.5,
  }).search(searchTerm);

  return (
    !mode && (
      <SearchFrameDiv blur={searchTerm !== ""}>
        <CenterColumn>
          <SearchBar setSearchTerm={setSearchTerm} value={searchTerm} />
          {searchTerm !== "" && (
            <SearchResults
              cityResults={cityResults}
              weekendResults={weekendResults}
              closeSearch={() => setSearchTerm("")}
            />
          )}
        </CenterColumn>
      </SearchFrameDiv>
    )
  );
};

export const SearchFrameDiv = styled.div`
  position: absolute;
  z-index: 10000;
  left: 0;
  right: 0;
  ${({ blur }) => blur && "height: 100%;"}
  display: flex;
  flex-direction: column;

  background-color: transparent;
  align-items: center;
  ${({ blur }) => blur && "backdrop-filter: blur(4px);"}
`;

const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;

  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  height: 100%;
  max-width: 480px;
`;
