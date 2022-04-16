import { format } from "date-fns";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { usePrideSelect } from "../../currentWeekNumberContext";
import { getFlagEmoji } from "../../getFlagEmoji";
import { prideName } from "../../prideName";

export const SearchResults = ({ cityResults, closeSearch }) => {
  const { selectCity } = usePrideSelect();

  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const newLocal = () => console.log("keydown");
    document.addEventListener("keydown", newLocal);
    return () => document.removeEventListener("keydown", newLocal);
  });

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 27) {
        // Escape
        console.log("closing search");
        closeSearch();
      } else if (e.keyCode === 38) {
        // Up
        if (selectedResult === null) {
          setSelectedResult(cityResults.length - 1);
        } else if (selectedResult > 0) {
          setSelectedResult(selectedResult - 1);
        }
      } else if (e.keyCode === 40) {
        // Down
        if (selectedResult === null) {
          setSelectedResult(0);
        } else if (selectedResult < cityResults.length - 1) {
          setSelectedResult(selectedResult + 1);
        }
      } else if (e.keyCode === 13) {
        // Enter
        if (selectedResult !== null) {
          selectCity(cityResults[selectedResult].item.city);
          closeSearch();
        }
      }
    }

    if (
      cityResults.length > 0 &&
      (selectedResult === null || selectedResult >= cityResults.length)
    ) {
      setSelectedResult(0);
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedResult, selectCity, cityResults, setSelectedResult, closeSearch]);

  return (
    <StyledSearchResults>
      {cityResults.map(({ item: pride, matches }, i) => {
        // const cityMatches = matches.filter(({ key }) => key === "city");

        return (
          <ResultBadge
            selected={selectedResult === i}
            onMouseMove={() => setSelectedResult(i)}
            onClick={() => {
              closeSearch();
              return selectCity(pride.city);
            }}
          >
            <PrideName>{prideName(pride)}</PrideName>
            <CityName>
              {/* {cityMatches[0] && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightSubstring(
                      pride.city,
                      cityMatches[0].indices[0][0],
                      cityMatches[0].indices[0][1]
                    ),
                  }}
                />
              )}{" "} */}
              {pride.city} {getFlagEmoji(pride.country)}
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

const PrideName = styled.div`
  font-size: 2em;
`;
const CityName = styled.div`
  font-size: 1em;
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
