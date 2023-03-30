import { AllowedMimeTypes, Required, RequiredBuffer, MaxFileSize } from "@/application/validation";
import { Controller, SavePictureController } from "@/application/controllers";

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
      changeProfilePicture.mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' });
   });

   beforeEach(() => {
      sut = new SavePictureController(changeProfilePicture);
   });

   it('should extend Controller', async () => {
      expect(sut).toBeInstanceOf(Controller);
   });

   it('should build Validator correctly', async () => {
      const validators = sut.buildValidators({ file, userId });

      expect(validators).toEqual([
         new Required(file, 'file'),
         new RequiredBuffer(buffer, 'file'),
         new AllowedMimeTypes(['jpg', 'png'], mimeType),
         new MaxFileSize(5, buffer)
      ]);
   });

   it('should call ChangeProfilePicture with correct input', async () => {
      await sut.handle({ file, userId });

      expect(changeProfilePicture).toHaveBeenCalledWith({ userId: userId, file: buffer });
      expect(changeProfilePicture).toHaveBeenCalledTimes(1);
   });

   it('should return 200 with valid data', async () => {
      const httpResponse = await sut.handle({ file, userId });

      expect(httpResponse).toEqual({
         statusCode: 200,
         data: { initials: 'any_initials', pictureUrl: 'any_url' }
      });
   });
});
