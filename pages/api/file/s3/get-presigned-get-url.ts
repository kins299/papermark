import { NextApiRequest, NextApiResponse } from "next";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getCloudfrontSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";

import { ONE_HOUR, ONE_SECOND } from "@/lib/constants";
import { getS3Client } from "@/lib/files/aws-client";
import { log } from "@/lib/utils";

const client = getS3Client();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  // Extract the API Key from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1]; // Assuming the format is "Bearer [token]"

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the API Key matches
  if (!process.env.INTERNAL_API_KEY) {
    log({
      message: "INTERNAL_API_KEY environment variable is not set",
      type: "error",
    });
    return res.status(500).json({ message: "Server configuration error" });
  }
  if (token !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { key } = req.body as { key: string };

  try {
    if (process.env.NEXT_PRIVATE_UPLOAD_DISTRIBUTION_DOMAIN) {
      const distributionUrl = new URL(
        key,
        `${process.env.NEXT_PRIVATE_UPLOAD_DISTRIBUTION_DOMAIN}`,
      );

      const url = getCloudfrontSignedUrl({
        url: distributionUrl.toString(),
        keyPairId: `${process.env.NEXT_PRIVATE_UPLOAD_DISTRIBUTION_KEY_ID}`,
        privateKey: `${process.env.NEXT_PRIVATE_UPLOAD_DISTRIBUTION_KEY_CONTENTS}`,
        dateLessThan: new Date(Date.now() + ONE_HOUR).toISOString(),
      });

      return res.status(200).json({ url });
    }

    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.NEXT_PRIVATE_UPLOAD_BUCKET,
      Key: key,
    });

    const url = await getS3SignedUrl(client, getObjectCommand, {
      expiresIn: ONE_HOUR / ONE_SECOND,
    });

    return res.status(200).json({ url });
  } catch (error) {
    log({
      message: `Error getting presigned get url for ${key} \n\n ${error}`,
      type: "error",
    });
    return res
      .status(500)
      .json({ error: "AWS Cloudfront Signed URL Error", message: error });
  }
}
