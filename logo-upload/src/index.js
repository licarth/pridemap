import fetch from "node-fetch";
import instagramdp from "instagramdp";
import { uploadBufferToBadge } from "./gcsUpload.js";

const id = process.argv[2];

// Do it for one image
// instagram blaze => picture URL
// download & upload to GCS
const getPictureLink = async (id) => {
  const {
    graphql: {
      user: { profile_pic_url_hd },
    },
  } = await (await fetch(`https://www.instagram.com/${id}/?__a=1`)).json();
  return profile_pic_url_hd;
};

const getPictureLinkImgInn = async (id) => {
  const link = await instagramdp.getDP(id);
  return link.picture;
};

const bucketName = "gs://pridemap-eu-assets";
const destFileName = `badges/instagram/${id}.png`;

(async () => {
  const url = await getPictureLinkImgInn(id);
  await uploadBufferToBadge({
    imageStream: (await fetch(url)).body,
    bucketName,
    destFileName,
  });
})();

// Get the logo URL from

// Store it in the firebase bucket as a public asset
