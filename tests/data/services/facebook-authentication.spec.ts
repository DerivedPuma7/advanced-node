import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";

import { mock } from "jest-mock-extended"

describe('FacebookAuthenticationService', () => {
   it('should call LoadFacebookUserApi with correct params', async () => {
      const loadFacebookUserApi = mock<LoadFacebookUserApi>();

      const sut = new FacebookAuthenticationService(loadFacebookUserApi);

      await sut.perform({ token: 'any token' });

      expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any token' });
      expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
   });

   it('should return authentication error when LoadFacebookUserApi returns undefined', async () => {
      const loadFacebookUserApi = mock<LoadFacebookUserApi>();
      loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

      const sut = new FacebookAuthenticationService(loadFacebookUserApi);

      const authResult = await sut.perform({ token: 'any token' });

      expect(authResult).toEqual(new AuthenticationError());
   });
});
