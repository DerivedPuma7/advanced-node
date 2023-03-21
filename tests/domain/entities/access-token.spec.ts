import { AccessToken } from "@/domain/entities";

describe('AccessToken', () => {
   it('should expire in 30 minutes', () => {
      const minutesToExpire = 30;
      const minutesToMilisseconds = 60 * 1000;
      const milisseconds = minutesToExpire * minutesToMilisseconds;

      expect(AccessToken.expirationInMs).toBe(milisseconds);
   });
});
