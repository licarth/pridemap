import ReactImageFallback from "react-image-fallback";

export const ImageWithFallback = ({ pride: { instagram }, className }) => (
  <ReactImageFallback
    src={`https://storage.googleapis.com/pridemap-eu-assets/badges/instagram/${instagram}.png`}
    // fallbackImage="my-backup.png"
    // initialImage="loader.gif"
    // alt="cool image should be here"
    className={className}
  />
);
