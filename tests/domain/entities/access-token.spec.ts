import { AccessToken } from "@/domain/entities";

describe('AccessToken', () => {
   it('should create with a value', () => {
      const sut = new AccessToken('any_value');

      expect(sut).toEqual({ value: 'any_value' });
   });

   it('should expire in 30 minutes', () => {
      const minutesToExpire = 30;
      const minutesToMilisseconds = 60 * 1000;
      const milisseconds = minutesToExpire * minutesToMilisseconds;

      expect(AccessToken.expirationInMs).toBe(milisseconds);
   });
});
