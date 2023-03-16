import { mock, MockProxy } from "jest-mock-extended";

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
   let sut: ValidationComposite;
   let validator1: MockProxy<Validator>;
   let validator2: MockProxy<Validator>;
   let validators: Validator[];

   beforeAll(() => {
      validator1 = mock();
      validator1.validade.mockReturnValue(undefined);
      validator2 = mock();
      validator2.validade.mockReturnValue(undefined);
      validators = [validator1, validator2];
   });

   beforeEach(() => {
      sut = new ValidationComposite(validators);
   });

   it('should return undefined if all validators returns undefined', () => {

      const sut = new ValidationComposite(validators);

      const error = sut.validate();

      expect(error).toBeUndefined();
   });
});
