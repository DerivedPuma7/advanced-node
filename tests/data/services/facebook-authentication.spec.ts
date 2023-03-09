import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";

import { mock, MockProxy } from "jest-mock-extended";

describe('FacebookAuthenticationService', () => {
   let facebookApi: MockProxy<LoadFacebookUserApi>;
   let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>;
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

   it('should call facebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
      await sut.perform({ token });

      expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
         name: 'any_facebook_name',
         email: 'any_facebook_email',
         facebookId: 'any_facebook_id',
      });
      expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
   });

   it('should call UpdateFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
      userAccountRepo.load.mockResolvedValueOnce({
         id: 'any_id',
         name: 'any name'
      });
      await sut.perform({ token });

      expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
         name: 'any name',
         id: 'any_id',
         facebookId: 'any_facebook_id',
      });
      expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
   });

   it('should update account name', async () => {
      userAccountRepo.load.mockResolvedValueOnce({
         id: 'any_id',
      });
      await sut.perform({ token });

      expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
         name: 'any_facebook_name',
         id: 'any_id',
         facebookId: 'any_facebook_id',
      });
      expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
   });
});
