import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";

import { mock, MockProxy } from "jest-mock-extended";

describe('FacebookAuthenticationService', () => {
   let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
   let sut: FacebookAuthenticationService;

   beforeEach(() => {
      loadFacebookUserApi = mock();
      sut = new FacebookAuthenticationService(loadFacebookUserApi);
   });

   it('should call LoadFacebookUserApi with correct params', async () => {
      await sut.perform({ token: 'any token' });

      expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any token' });
      expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
   });

   it('should return authentication error when LoadFacebookUserApi returns undefined', async () => {
      loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

      const authResult = await sut.perform({ token: 'any token' });

      expect(authResult).toEqual(new AuthenticationError());
   });
});
