import { RequiredFieldError } from "@/application/errors";
import { badRequest, HttpResponse } from "@/application/helpers";
import { ChangeProfilePicture } from "@/domain/use-cases";

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string };
type Model = Error;

class SavePictureController {
   constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}

   async handle({ file, userId }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
      if(file === undefined || file === null) return badRequest(new RequiredFieldError('file'));
      if(file.buffer.length === 0) return badRequest(new RequiredFieldError('file'));
      if(!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']));
      if(file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5));

      await this.changeProfilePicture({ userId, file: file.buffer });
   }
}

class InvalidMimeTypeError extends Error {
   constructor(allowed: string[]) {
      super(`Unsupported type. Allowed types: ${allowed.join(', ')}`);
      this.name = 'InvalidMimeType';
   }
}

class MaxFileSizeError extends Error {
   constructor(maxFileSizeInMb: number) {
      super(`File upload limit is ${maxFileSizeInMb}MB`);
      this.name = 'MaxFileSizeError';
   }
}

describe('SavePictureController', () => {
   let sut: SavePictureController;
   let buffer: Buffer;
   let mimeType: string;
   let file: { buffer: Buffer, mimeType: string }
   let userId: string;
   let changeProfilePicture: jest.Mock;

   beforeAll(() => {
      buffer = Buffer.from('any_buffer');
      mimeType = 'image/png';
      file = { buffer, mimeType };
      userId = 'any_user_id';
      changeProfilePicture = jest.fn();
   });

   beforeEach(() => {
      sut = new SavePictureController(changeProfilePicture);
   });

   describe('file', () => {
      it('should return 400 if file is not provided', async () => {
         const httpResponse = await sut.handle({ file: undefined as any, userId });

         expect(httpResponse).toEqual({
            statusCode: 400,
            data: new RequiredFieldError('file')
         });
      });

      it('should return 400 if file is not provided', async () => {
         const httpResponse = await sut.handle({ file: null as any, userId });

         expect(httpResponse).toEqual({
            statusCode: 400,
            data: new RequiredFieldError('file')
         });
      });

      it('should return 400 if file is empty', async () => {
         const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType }, userId });

         expect(httpResponse).toEqual({
            statusCode: 400,
            data: new RequiredFieldError('file')
         });
      });
   });

   describe('mime type', () => {
      it('should return 400 if file type is invalid', async () => {
         const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' }, userId });

         expect(httpResponse).toEqual({
            statusCode: 400,
            data: new InvalidMimeTypeError(['png', 'jpeg'])
         });
      });

      it('should not return 400 if file type is valid', async () => {
         const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' }, userId });

         expect(httpResponse).not.toEqual({
            statusCode: 400,
            data: new InvalidMimeTypeError(['png', 'jpeg'])
         });
      });

      it('should not return 400 if file type is valid', async () => {
         const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId });

         expect(httpResponse).not.toEqual({
            statusCode: 400,
            data: new InvalidMimeTypeError(['png', 'jpeg'])
         });
      });

      it('should not return 400 if file type is valid', async () => {
         const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' }, userId });

         expect(httpResponse).not.toEqual({
            statusCode: 400,
            data: new InvalidMimeTypeError(['png', 'jpeg'])
         });
      });
   });

   describe('file size', () => {
      it('should return 400 if file size is bigger than 5MB', async () => {
         const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024));
         const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId });

         expect(httpResponse).toEqual({
            statusCode: 400,
            data: new MaxFileSizeError(5)
         });
      });

      it('should not return 400 if file size is not bigger than 5MB', async () => {
         const invalidBuffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024));
         const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId });

         expect(httpResponse).not.toEqual({
            statusCode: 400,
            data: new MaxFileSizeError(5)
         });
      });
   });

   it('should call ChangeProfilePicture with correct input', async () => {
      await sut.handle({ file, userId });

      expect(changeProfilePicture).toHaveBeenCalledWith({ userId: userId, file: buffer });
      expect(changeProfilePicture).toHaveBeenCalledTimes(1);
   });
});
