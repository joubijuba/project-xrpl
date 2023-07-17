import {
  DecryptCommand,
  DecryptCommandInput,
  DecryptCommandOutput,
  EncryptCommand,
  EncryptCommandInput,
  EncryptCommandOutput,
  KMSClient,
  ListKeysCommand,
  ListKeysCommandInput,
  ListKeysResponse,
} from "@aws-sdk/client-kms";
import { SubscriptionDataDto } from "../dtos/models";
import { kmsClient } from "../clients/KmsClient";

export default class EncryptionService {
  kmsClient: KMSClient;

  constructor() {
    this.kmsClient = kmsClient;
  }

  async getKeyId(): Promise<string | any> {
    const input: ListKeysCommandInput = {
      Limit: 1,
    };
    try {
      const command: ListKeysCommand = new ListKeysCommand(input);
      const response: ListKeysResponse = await this.kmsClient.send(command);
      if (response.Keys && response.Keys.length > 0) {
        return response.Keys[0].KeyId!;
      }
    } catch (e: any) {
      return e.message.toString();
    }
  }

  async encryptData(
    subscriptionData: Omit<SubscriptionDataDto, "erc20address">
  ): Promise<string> {
    try {
      const keyId = await this.getKeyId();
      const encoder = new TextEncoder();
      let stringifiedData: string = "";
      let key: keyof typeof subscriptionData;
      for (key in subscriptionData) {
        if (
          Object.keys(subscriptionData).indexOf(key) ===
          Object.keys(subscriptionData).length - 1
        ) {
          stringifiedData.concat(key, "=", subscriptionData[key]);
          break;
        }
        stringifiedData.concat(key, "=", subscriptionData[key], "&");
      }
      const uint8Arr = encoder.encode(stringifiedData);
      const input: EncryptCommandInput = {
        KeyId: keyId,
        Plaintext: uint8Arr,
      };
      const command = new EncryptCommand(input);
      const response: EncryptCommandOutput = await this.kmsClient.send(command);
      return Buffer.from(response.CiphertextBlob!).toString("base64");
    } catch (e: any) {
      return e.message.toString();
    }
  }

  async decryptData(encryptedData: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const uint8arr = encoder.encode(encryptedData);
      const input: DecryptCommandInput = {
        CiphertextBlob: uint8arr,
      };
      const command = new DecryptCommand(input);
      const response: DecryptCommandOutput = await this.kmsClient.send(command);
      return Buffer.from(response.Plaintext!).toString("base64");
    } catch (e: any) {
      return e.message.toString();
    }
  }
}
