import styled from "styled-components";

export const SearchBar = ({ setSearchTerm, value }) => {
  return (
    <StyledSearchBar
      placeholder="Search prides..."
      onChange={(e) => setSearchTerm(e.target.value)}
      value={value}
    />
  );
};

const StyledSearchBar = styled.input`
  background: transparent;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  &:focus {
    outline: none;
  }
  font-weight: 100;
  font-size: 2em;
`;
