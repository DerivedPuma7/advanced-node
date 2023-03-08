import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { LoadUserAccountRepository } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";

import { mock, MockProxy } from "jest-mock-extended";

describe('FacebookAuthenticationService', () => {
   let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
   let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
   let sut: FacebookAuthenticationService;

   beforeEach(() => {
      loadFacebookUserApi = mock();
      loadUserAccountRepo = mock();
      sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo);

      loadFacebookUserApi.loadUser.mockResolvedValue({
         name: 'any_facebook_name',
         email: 'any_facebook_email',
         facebookId: 'any_facebook_id',
      });
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

   it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
      await sut.perform({ token: 'any token' });

      expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
      expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
   });
});
