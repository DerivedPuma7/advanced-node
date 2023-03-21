import { LoadFacebookUserApi } from "@/domain/contracts/apis";
import { TokenGenerator } from "@/domain/contracts/crypto";
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from "@/domain/contracts/repos";
import { setupFacebookAuthentication, FacebookAuthentication } from "@/domain/use-cases/facebook-authentication";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";

import { mock, MockProxy } from "jest-mock-extended";

jest.mock('@/domain/entities/facebook-account');

describe('FacebookAuthentication', () => {
   let facebookApi: MockProxy<LoadFacebookUserApi>;
   let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
   let crypto: MockProxy<TokenGenerator>;
   let sut: FacebookAuthentication;

   let token: string;

   beforeAll(() => {
      token = 'any_token';

      facebookApi = mock();
      facebookApi.loadUser.mockResolvedValue({
         name: 'any_facebook_name',
         email: 'any_facebook_email',
         facebookId: 'any_facebook_id',
      });

      userAccountRepo = mock();
      userAccountRepo.load.mockResolvedValue(undefined);
      userAccountRepo.saveWithFacebook.mockResolvedValue({
         id: 'any_account_id'
      });

      crypto = mock();
      crypto.generateToken.mockResolvedValue('any_generated_token');
   });

   beforeEach(() => {
      sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto);
   });

   it('should call LoadFacebookUserApi with correct params', async () => {
      await sut({ token });

      expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
      expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
   });

   it('should throw authentication error when LoadFacebookUserApi returns undefined', async () => {
      facebookApi.loadUser.mockResolvedValueOnce(undefined);
      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new AuthenticationError());
   });

   it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
      await sut({ token: 'any token' });

      expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
      expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
   });

   it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
      const FacebookAccountStub = jest.fn().mockImplementation(() => {
         return { any: 'any' };
      });
      jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

      await sut({ token });

      expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
      expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
   });

   it('should call TokenGenerator with correct params', async () => {
      await sut({ token });

      expect(crypto.generateToken).toHaveBeenCalledWith({
         key: 'any_account_id',
         expirationInMs: AccessToken.expirationInMs
      });
      expect(crypto.generateToken).toHaveBeenCalledTimes(1);
   });

   it('should return an AccessToken on success', async () => {
      const authResult = await sut({ token });

      expect(authResult).toEqual({ accessToken: 'any_generated_token' });
   });

   it('should rethrow if LoadFacebookUserApi throws', async () => {
      facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));

      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new Error('fb_error'));
   });

   it('should rethrow if LoadUserAccountRepository throws', async () => {
      userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'));

      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new Error('load_error'));
   });

   it('should rethrow if SaveFacebookAccountRepository throws', async () => {
      userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));

      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new Error('save_error'));
   });

   it('should rethrow if TokenGenerator throws', async () => {
      crypto.generateToken.mockRejectedValueOnce(new Error('generate_token_error'));

      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new Error('generate_token_error'));
   });
});
