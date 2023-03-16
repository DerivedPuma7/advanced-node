import { mock } from "jest-mock-extended";

interface Validator {
   validade: () => Error | undefined
}

class ValidationComposite {
   constructor(private readonly validators: Validator[]) {}

   validate(): Error | undefined {
      return;
   }
}

describe('ValidationComposite', () => {
   it('should return undefined if all validators returns undefined', () => {
      const validator1 = mock<Validator>();
      validator1.validade.mockReturnValue(undefined);

      const validator2 = mock<Validator>();
      validator2.validade.mockReturnValue(undefined);

      const validators = [validator1, validator2];
      const sut = new ValidationComposite(validators);

      const error = sut.validate();

      expect(error).toBeUndefined();
   });
});
