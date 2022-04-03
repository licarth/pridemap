import _ from "lodash";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getColorFromLatitude } from "./getColorFromLatitude";

export const ImageWithFallback = ({
  pride: { instagram, autoPictureLink, manualPictureLink, pin, city },
  className,
}) => {
  const [src, setSrc] = useState();

  useEffect(() => {
    (async () => {
      setSrc(null);

      const links = _.filter(
        [
          manualPictureLink,
          instagram &&
            `https://storage.googleapis.com/pridemap-eu-assets/badges/instagram/${instagram}.png`,
          autoPictureLink,
        ],
        (i) => !_.isEmpty(i)
      );

      for (const link of links) {
        if (await setImageFromLink(link, setSrc)) {
          break;
        }
      }
    })();
  }, [city, instagram, autoPictureLink, manualPictureLink]);
  return src ? (
    <LogoWithBorder
      alt={`${city} pride logo`}
      key={`logo-${city}`}
      src={src}
      className={className}
      latitude={pin.lat}
    />
  ) : (
    <></>
  );
};

async function setImageFromLink(linnk, setSrc) {
  try {
    const res = await fetch(linnk);
    const imageBlob = await res.blob();
    if (!`${res.status}`.startsWith(2)) {
      return false;
    }
    const imageObjectURL = window.URL.createObjectURL(imageBlob);
    setSrc(imageObjectURL);
  } catch (e) {
    return false;
  }
  return true;
}

const LogoWithBorder = styled.img`
  border: solid
    ${({ latitude }) => {
      console.log(getColorFromLatitude(latitude));
      return getColorFromLatitude(latitude).main;
    }}
    5px;
  box-sizing: content-box;
`;
