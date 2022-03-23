import ReactImageFallback from "react-image-fallback";

export const ImageWithFallback = ({ instagramId, facebookId, className }) => (
  <ReactImageFallback
    src={`https://storage.googleapis.com/pridemap-eu-assets/badges/instagram/${instagramId}.png`}
    // fallbackImage="my-backup.png"
    // initialImage="loader.gif"
    // alt="cool image should be here"
    className={className}
  />
);
