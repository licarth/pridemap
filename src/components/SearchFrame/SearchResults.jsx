import { format } from "date-fns";
import { useState } from "react";
import styled from "styled-components";
import { usePrideSelect } from "../../currentWeekNumberContext";
import { getFlagEmoji } from "../../getFlagEmoji";

const highlightSubstring = (str, startIndex, endIndex) => {
  const highlight = str.slice(startIndex, endIndex + 1);
  return str.replace(highlight, `<span class="highlight">${highlight}</span>`);
};

export const SearchResults = ({ cityResults, closeSearch }) => {
  const { selectCity } = usePrideSelect();

  const [selectedResult, setSelectedResult] = useState(null);

  return (
    <StyledSearchResults>
      {cityResults.map(({ item: pride, matches }, i) => {
        const cityMatches = matches.filter(({ key }) => key === "city");

        return (
          <ResultBadge
            selected={selectedResult === i}
            onMouseEnter={() => setSelectedResult(i)}
            onClick={() => {
              closeSearch();
              return selectCity(pride.city);
            }}
          >
            <CityName>
              {cityMatches[0] && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightSubstring(
                      pride.city,
                      cityMatches[0].indices[0][0],
                      cityMatches[0].indices[0][1]
                    ),
                  }}
                />
              )}{" "}
              {getFlagEmoji(pride.country)}
            </CityName>
            <Date>
              {pride.paradeStartDate && format(pride.paradeStartDate, "d MMM")}
            </Date>
          </ResultBadge>
        );
      })}
    </StyledSearchResults>
  );
};

const StyledSearchResults = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  height: 100%;
  overflow: scroll;

  .highlight {
    font-weight: 900;
  }
`;

const CityName = styled.div`
  font-size: 2em;
`;

const Date = styled.div`
  font-size: 1em;
`;

const ResultBadge = styled.div`
  display: flex;
  flex-direction: column;
  ${({ selected }) => selected && "background: #ffc40085;"}
  border-radius: 5px;
  padding: 5px;
`;
