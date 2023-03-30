import { AllowedMimeTypes } from "@/application/validation";
import { InvalidMimeTypeError } from "@/application/errors";

describe('AllowedMimeTypes', () => {
   it('should return InvalidMimeTypeError if value is invalid', () => {
      const sut = new AllowedMimeTypes(['png'], 'image/jpg');

      const error = sut.validate();

      expect(error).toEqual(new InvalidMimeTypeError(['png']));
   });

   it('should return undefined if value is valid', () => {
      const sut = new AllowedMimeTypes(['png'], 'image/png');

      const error = sut.validate();

      expect(error).toBeUndefined();
   });

   it('should return undefined if value is valid', () => {
      const sut = new AllowedMimeTypes(['jpg'], 'image/jpg');

      const error = sut.validate();

      expect(error).toBeUndefined();
   });

   it('should return undefined if value is valid', () => {
      const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg');

      const error = sut.validate();

      expect(error).toBeUndefined();
   });
});
