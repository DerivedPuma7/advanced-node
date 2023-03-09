import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAccount } from "@/domain/models";

import { mock, MockProxy } from "jest-mock-extended";

jest.mock('@/domain/models/facebook-account');

describe('FacebookAuthenticationService', () => {
   let facebookApi: MockProxy<LoadFacebookUserApi>;
   let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
   let sut: FacebookAuthenticationService;

   const token = 'any_token';

   beforeEach(() => {
      facebookApi = mock();
      userAccountRepo = mock();
      sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);

      facebookApi.loadUser.mockResolvedValue({
         name: 'any_facebook_name',
         email: 'any_facebook_email',
         facebookId: 'any_facebook_id',
      });

      userAccountRepo.load.mockResolvedValue(undefined);
   });

   it('should call LoadFacebookUserApi with correct params', async () => {
      await sut.perform({ token });

      expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
      expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
   });

   it('should return authentication error when LoadFacebookUserApi returns undefined', async () => {
      facebookApi.loadUser.mockResolvedValueOnce(undefined);
      const authResult = await sut.perform({ token });

      expect(authResult).toEqual(new AuthenticationError());
   });

   it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
      await sut.perform({ token: 'any token' });

      expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
      expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
   });

   it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
      const FacebookAccountStub = jest.fn().mockImplementation(() => {
         return { any: 'any' };
      });
      jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

      await sut.perform({ token });

      expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
      expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
   });
});
