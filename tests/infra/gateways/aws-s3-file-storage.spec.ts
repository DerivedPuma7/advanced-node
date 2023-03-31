import { AwsS3FileStorage } from "@/infra/gateways"

import { config, S3 } from "aws-sdk";

jest.mock("aws-sdk");

describe('AwsS3FileStorage', () => {
   let sut: AwsS3FileStorage;
   let accessKey: string;
   let secret: string;
   let bucket: string;
   let fileName: string;

   beforeAll(() => {
      accessKey = 'any_access_key';
      secret = 'any_secret';
      bucket = 'any_bucket';
      fileName = 'any_file_name';
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

   describe('upload', () => {
      let file: Buffer;
      let putObjectPromiseSpy: jest.Mock;
      let putObjectSpy: jest.Mock;

      beforeAll(() => {
         file = Buffer.from('any_buffer');

         putObjectPromiseSpy = jest.fn();
         putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }));
         jest.mocked(S3).mockImplementation(
            jest.fn().mockImplementation(() => ({
               putObject: putObjectSpy
            }))
         );
      });

      it('should call putObject with correct input', async () => {
         await sut.upload({ fileName, file });

         expect(putObjectSpy).toHaveBeenCalledWith({
            Bucket: bucket,
            Key: fileName,
            Body: file,
            ACL: 'public-read'
         });
         expect(putObjectSpy).toHaveBeenCalledTimes(1);
         expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
      });

      it('should return file url', async () => {
         const fileUrl = await sut.upload({ fileName, file });

         expect(fileUrl).toBe(`https://${bucket}.s3.amazonaws.com/${fileName}`);
      });

      it('should return encoded file url', async () => {
         const fileUrl = await sut.upload({ fileName: 'any file name', file });

         expect(fileUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20file%20name`);
      });

      it('should rethrows if putObject throws', async () => {
         const error = new Error('upload_error');
         putObjectPromiseSpy.mockRejectedValueOnce(error);

         const promise = sut.upload({ fileName, file });

         await expect(promise).rejects.toThrow(error);
      });
   });

   describe('delete', () => {
      let deleteObjectPromiseSpy: jest.Mock;
      let deleteObjectSpy: jest.Mock;

      beforeAll(() => {
         deleteObjectPromiseSpy = jest.fn();
         deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }));
         jest.mocked(S3).mockImplementation(
            jest.fn().mockImplementation(() => ({
               deleteObject: deleteObjectSpy
            }))
         );
      });

      it('should call deleteObject with correct input', async () => {
         await sut.delete({ fileName });

         expect(deleteObjectSpy).toHaveBeenCalledWith({
            Bucket: bucket,
            Key: fileName
         });
         expect(deleteObjectSpy).toHaveBeenCalledTimes(1);
         expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1);
      });

      it('should rethrows if deleteObject throws', async () => {
         const error = new Error('upload_error');
         deleteObjectPromiseSpy.mockRejectedValueOnce(error);

         const promise = sut.delete({ fileName });

         await expect(promise).rejects.toThrow(error);
      });
   });
});
