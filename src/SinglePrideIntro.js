import { format } from "date-fns";
import React from "react";
import {
  FaFacebookSquare,
  FaFlag,
  FaInstagram,
  FaMapMarkerAlt,
  FaTwitterSquare,
} from "react-icons/fa";
import styled from "styled-components";
import { BlackLink } from "./BlackLink";
import { getFlagEmoji } from "./getFlagEmoji";
import { ImageWithFallback } from "./ImageWithFallback";

export const SinglePrideIntro = ({ pride, resetSelection }) => {
  if (!pride) return null;

  return (
    <PrideIntroContainer>
      <StyledCloseButton resetSelection={resetSelection} />
      <TopDescription>
        <LeftDetails>
          <PrideTitle>{pride.name || `${pride.city} Pride`}</PrideTitle>
          <DescriptionBody>
            <PrideLongName pride={pride} />
            <ParadeDate pride={pride} />
          </DescriptionBody>
        </LeftDetails>
        <RightLogo>
          <PrideBadge pride={pride} />
        </RightLogo>
      </TopDescription>

      <BadgesContainer>
        {pride.instagram && <InstagramBadge id={pride.instagram} />}
        {pride.facebook && <FacebookBadge id={pride.facebook} />}
        {pride.twitter && <TwitterBadge id={pride.twitter} />}
      </BadgesContainer>
      {pride.source && <WebsiteLink source={pride.source} />}
    </PrideIntroContainer>
  );
};

const TopDescription = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
`;

const LeftDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightLogo = styled.div`
  width: 100px;
  height: 100px;
  margin-left: 30px;
  margin-right: 10px;
  margin-top: 20px;
  align-self: center;
`;

const DescriptionBody = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
`;

const PrideBadge = ({ pride }) => <>{<ProfilePicture pride={pride} />}</>;
const ProfilePicture = styled(ImageWithFallback)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const WebsiteLink = ({ source }) => (
  <BlackLink target={"_blank"} href={source}>
    {new URL(source).hostname}
  </BlackLink>
);

const PrideLongName = ({ pride }) => (
  <span>
    <FaMapMarkerAlt /> {pride.city + " "}
    {getFlagEmoji(pride.country)}
  </span>
);

const ParadeDate = ({ pride }) => (
  <span>
    <FaFlag />{" "}
    {pride?.paradeStartDate
      ? format(pride.paradeStartDate, "EEE, MMMM do")
      : "To be announced"}
  </span>
);

const InstagramBadge = ({ id }) => (
  <LogoLink target={"_blank"} href={`https://www.instagram.com/${id}`}>
    {logo(FaInstagram)}
  </LogoLink>
);

const FacebookBadge = ({ id }) => (
  <LogoLink target={"_blank"} href={`https://www.facebook.com/${id}`}>
    {logo(FaFacebookSquare)}
  </LogoLink>
);

const TwitterBadge = ({ id }) => (
  <LogoLink target={"_blank"} href={`https://twitter.com/${id}`}>
    {logo(FaTwitterSquare)}
  </LogoLink>
);

const PrideTitle = styled.h1``;

const PrideIntroContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoLink = styled.a`
  color: white;
`;

const BadgesContainer = styled.div`
  display: flex;
  margin-left: 10px;
`;

const logo = (logo) =>
  React.createElement(styled(logo)`
    height: 30px;
    width: 30px;
    margin-right: 10px;
    border-radius: 5px;
    :hover {
      filter: invert(1);
      background: black;
      cursor: pointer;
    }
  `);

const StyledCloseButton = ({ resetSelection }) => {
  return (
    <CloseButton
      onClick={() => {
        resetSelection();
      }}
    >
      ╳
    </CloseButton>
  );
};

const CloseButton = styled.span`
  position: absolute;
  right: 0px;
  margin-top: 10px;
  margin-right: 20px;
  font-size: large;
  cursor: pointer;
`;
