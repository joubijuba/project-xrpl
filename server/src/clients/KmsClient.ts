import { KMSClient } from "@aws-sdk/client-kms";

export const kmsClient = new KMSClient({ region: "eu-west-1" });