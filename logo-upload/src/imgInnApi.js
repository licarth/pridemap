import instagramdp from "instagramdp";

export const getPictureLinkImgInn = async (id) => {
  const link = await instagramdp.getDP(id);
  return link.picture;
};
