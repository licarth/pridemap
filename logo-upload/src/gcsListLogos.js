import { Storage } from "@google-cloud/storage";

export const listBucketFiles = async ({ bucketName, directory }) => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const [files] = await bucket.getFiles({
    prefix: directory,
  });
  return files.map((f) => f.name);
};
