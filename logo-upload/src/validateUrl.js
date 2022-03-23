import * as Either from "fp-ts/lib/Either.js";

export const validateUrl = (url) =>
  url.startsWith("https") ? Either.right() : Either.left("Invalid URL");
