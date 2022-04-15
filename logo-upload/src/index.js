import { pipe } from "fp-ts/lib/function.js";
import fetch from "node-fetch";
import { uploadBufferToBadge } from "./gcsUpload.js";
import { getPictureLinkImgInn } from "./imgInnApi.js";
import { validateUrl } from "./validateUrl.js";
import * as Either from "fp-ts/lib/Either.js";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { throttledPromises } from "./throttlePromise.js";

const bucketName = "gs://pridemap-eu-assets";
const destFileName = (id) => `badges/instagram/${id}.png`;

(async () => {
  //Fetch ids from Google Sheet
  const doc = new GoogleSpreadsheet(
    "1P7xHRf4C7Gh6HBc1FdJbdxO73UqgM-_TbAm6341SutI"
  );
  doc.useApiKey("AIzaSyApxCH8P9AHi9gJmDm4wFzljmhAfGoa9b0");
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const ids = [];
  (await sheet.getRows({ offset: 1 })).map(async (p) => {
    if (p.instagram) {
      ids.push(p.instagram);
    }
  });
  await throttledPromises(uploadLogo, ids, 5, 1000);
})();

async function uploadLogo(id) {
  const url = await getPictureLinkImgInn(id);
  pipe(
    validateUrl(url),
    Either.fold(
      (e) => {
        console.log(`FAILURE: ${id}, Invalid URL`);
      },
      async () => {
        try {
          await uploadBufferToBadge({
            imageStream: (await fetch(url)).body,
            bucketName,
            destFileName: destFileName(id),
          });
        } catch (e) {
          console.log(`FAILURE: ${id}, Unable to upload`);
        }
        console.log(`SUCCESS: ${id}`);
      }
    )
  );
}
// Get the logo URL from

// Store it in the firebase bucket as a public asset
