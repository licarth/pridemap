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

export const SinglePrideIntro = ({ pride }) => {
  if (!pride) return null;

  return (
    <PrideIntroContainer>
      <PrideBadge imageUrl={pride.mainPictureLink} />
      <PrideTitle>{pride.name || `${pride.city} pride`}</PrideTitle>
      <DescriptionBody>
        <CityLocation pride={pride} />
        <ParadeDate pride={pride} />
      </DescriptionBody>
      <BadgesContainer>
        {pride.instagram && <InstagramBadge id={pride.instagram} />}
        {pride.facebook && <FacebookBadge id={pride.facebook} />}
        {pride.twitter && <TwitterBadge id={pride.twitter} />}
      </BadgesContainer>
      {pride.source && <WebsiteLink source={pride.source} />}
    </PrideIntroContainer>
  );
};

const DescriptionBody = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
`;

const PrideBadge = ({ imageUrl }) => (
  <>{imageUrl && <ProfilePicture src={imageUrl} />}</>
);
const ProfilePicture = styled.img`
  position: absolute;
  right: 20px;
  top: 50px;
  height: 100px;
  border-radius: 50%;
`;

const WebsiteLink = ({ source }) => (
  <BlackLink target={"_blank"} href={source}>
    {new URL(source).hostname}
  </BlackLink>
);

const CityLocation = ({ pride }) => (
  <span>
    <FaMapMarkerAlt /> {pride.city} {getFlagEmoji(pride.country)}
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

const PrideTitle = styled.h1`
  align-self: flex-start;
`;

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
