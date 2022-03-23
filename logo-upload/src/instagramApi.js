import fetch from "node-fetch";

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
