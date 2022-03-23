// Imports the Google Cloud client library
import { Storage } from "@google-cloud/storage";

// Import Node.js stream
export const uploadBufferToBadge = async ({
  imageStream,
  bucketName,
  destFileName,
}) => {
  const storage = new Storage();
  const myBucket = storage.bucket(bucketName);
  const file = myBucket.file(destFileName);

  imageStream
    .pipe(file.createWriteStream())
    .on("finish", () => {
      console.log(`upload complete`);
      // The file upload is complete
    })
    .on("error", (e) => {
      console.log(e);
    });

  console.log(`${destFileName} uploaded to ${bucketName}`);
};
