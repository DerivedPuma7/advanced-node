import { UploadFile } from "@/domain/contracts/gateways"

import { config, S3 } from "aws-sdk";
import { buffer } from "stream/consumers";

jest.mock("aws-sdk");

class AwsS3FileStorage implements UploadFile {
   constructor(
      accessKey: string,
      secret: string,
      private readonly bucket: string
   ) {
      config.update({
         credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secret
         }
      });
   }

   async upload({ key, file }: UploadFile.Input): Promise<UploadFile.Output> {
      const s3 = new S3();
      const fileUrl = await s3.putObject({
         Bucket: this.bucket,
         Key: key,
         Body: file,
         ACL: 'public-read'
      }).promise();

      return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`;
   }
}

describe('AwsS3FileStorage', () => {
   let sut: AwsS3FileStorage;
   let accessKey: string;
   let secret: string;
   let bucket: string;
   let key: string;
   let file: Buffer;
   let putObjectPromiseSpy: jest.Mock;
   let putObjectSpy: jest.Mock;

   beforeAll(() => {
      accessKey = 'any_access_key';
      secret = 'any_secret';
      bucket = 'any_bucket';
      key = 'any_key';
      file = Buffer.from('any_buffer');

      putObjectPromiseSpy = jest.fn();
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }));
      jest.mocked(S3).mockImplementation(
         jest.fn().mockImplementation(() => ({
            putObject: putObjectSpy
         }))
      );
   });

   beforeEach(() => {
      sut = new AwsS3FileStorage(accessKey, secret, bucket);
   });

   it('should config aws credentials on creation', async () => {
      expect(sut).toBeDefined();
      expect(config.update).toHaveBeenCalledWith({
         credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secret
         }
      });
      expect(config.update).toHaveBeenCalledTimes(1);
   });

   it('should call putObject with correct input', async () => {
      await sut.upload({ key, file });

      expect(putObjectSpy).toHaveBeenCalledWith({
         Bucket: bucket,
         Key: key,
         Body: file,
         ACL: 'public-read'
      });
      expect(putObjectSpy).toHaveBeenCalledTimes(1);
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
   });

   it('should return file url', async () => {
      const fileUrl = await sut.upload({ key, file });

      expect(fileUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`);
   });

   it('should return encoded file url', async () => {
      const fileUrl = await sut.upload({ key: 'any key', file });

      expect(fileUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`);
   });
});
