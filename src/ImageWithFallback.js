import _ from "lodash";
import { useEffect, useState } from "react";

export const ImageWithFallback = ({
  pride: { instagram, autoPictureLink, manualPictureLink, twitter, city },
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
    <img
      alt={`${city} pride logo`}
      key={`logo-${city}`}
      src={src}
      className={className}
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