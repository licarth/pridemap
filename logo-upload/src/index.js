import { pipe } from "fp-ts/lib/function.js";
import fetch from "node-fetch";
import { uploadBufferToBadge } from "./gcsUpload.js";
import { getPictureLinkImgInn } from "./imgInnApi.js";
import { validateUrl } from "./validateUrl.js";
import * as Either from "fp-ts/lib/Either.js";

const id = process.argv[2];

const bucketName = "gs://pridemap-eu-assets";
const destFileName = `badges/instagram/${id}.png`;

(async () => {
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
            destFileName,
          });
        } catch (e) {
          console.log(`FAILURE: ${id}, Unable to upload`);
        }
        console.log(`SUCCESS: ${id}`);
      }
    )
  );
})();

// Get the logo URL from

// Store it in the firebase bucket as a public asset
