// Imports the Google Cloud client library
import { Storage } from "@google-cloud/storage";

// Import Node.js stream
export const uploadBufferToBadge = async ({
  imageStream,
  bucketName,
  destFileName,
}) =>
  new Promise((resolve, reject) => {
    const storage = new Storage();
    const myBucket = storage.bucket(bucketName);
    const file = myBucket.file(destFileName);

    imageStream
      .pipe(file.createWriteStream())
      .on("finish", () => {
        resolve();
        // The file upload is complete
      })
      .on("error", (e) => {
        reject();
      });
  });
