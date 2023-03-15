import { RequiredFieldError } from "@/application/errors";
import { RequiredStringValidator } from "@/application/validation";

describe('RequiredStringValidator', () => {
   it('should return RequiredFieldError if value is empty', async () => {
      const sut = new RequiredStringValidator('', 'any_field');

      const error = sut.validate();

      expect(error).toEqual(new RequiredFieldError('any_field'));
   });

   it('should return RequiredFieldError if value is null', async () => {
      const sut = new RequiredStringValidator(null as any, 'any_field');

      const error = sut.validate();

      expect(error).toEqual(new RequiredFieldError('any_field'));
   });

   it('should return RequiredFieldError if value is undefined', async () => {
      const sut = new RequiredStringValidator(undefined as any, 'any_field');

      const error = sut.validate();

      expect(error).toEqual(new RequiredFieldError('any_field'));
   });

   it('should return undefined if value is not empty', async () => {
      const sut = new RequiredStringValidator('any_value', 'any_field');

      const error = sut.validate();

      expect(error).toBeUndefined();
   });
});
