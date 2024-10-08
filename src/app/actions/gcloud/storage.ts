"use server";

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

const storage = new Storage();

const generateSignedUrl = async (fileName: string) => {
  if (!process.env.BUCKET_NAME) {
    throw new Error("BUCKET_NAME is not set");
  }

  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!keyPath) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
  }

  const options = {
    version: "v2",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // one hour
  } as GetSignedUrlConfig;

  const [url] = await storage
    .bucket(process.env.BUCKET_NAME)
    .file(fileName)
    .getSignedUrl(options);

  return url;
};

export const uploadFile = async (
  base64Data: string,
  destination: string,
  generationMatchPrecondition: number = 0
) => {
  if (!process.env.BUCKET_NAME) {
    throw new Error("BUCKET_NAME is not set");
  }

  const options = {
    destination: destination,
    preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
  };

  try {
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Content, "base64");

    await storage
      .bucket(process.env.BUCKET_NAME)
      .file(destination)
      .save(buffer, options);

    const url = await generateSignedUrl(destination);

    console.log(`File uploaded to ${destination}`);

    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
