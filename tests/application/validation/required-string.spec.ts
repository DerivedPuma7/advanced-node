import { RequiredFieldError } from "@/application/errors";
import { RequiredString } from "@/application/validation";

describe('RequiredString', () => {
   it('should return RequiredFieldError if value is empty', async () => {
      const sut = new RequiredString('', 'any_field');

      const error = sut.validate();

      expect(error).toEqual(new RequiredFieldError('any_field'));
   });

   it('should return RequiredFieldError if value is null', async () => {
      const sut = new RequiredString(null as any, 'any_field');

      const error = sut.validate();

      expect(error).toEqual(new RequiredFieldError('any_field'));
   });

   it('should return RequiredFieldError if value is undefined', async () => {
      const sut = new RequiredString(undefined as any, 'any_field');

      const error = sut.validate();

      expect(error).toEqual(new RequiredFieldError('any_field'));
   });

   it('should return undefined if value is not empty', async () => {
      const sut = new RequiredString('any_value', 'any_field');

      const error = sut.validate();

      expect(error).toBeUndefined();
   });
});
