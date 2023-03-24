import { LoadFacebookUser, TokenGenerator } from "@/domain/contracts/gateways";
import { SaveFacebookAccount, LoadUserAccount } from "@/domain/contracts/repos";
import { setupFacebookAuthentication, FacebookAuthentication } from "@/domain/use-cases/facebook-authentication";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";

import { mock, MockProxy } from "jest-mock-extended";

jest.mock('@/domain/entities/facebook-account');

describe('FacebookAuthentication', () => {
   let facebookApi: MockProxy<LoadFacebookUser>;
   let userAccountRepo: MockProxy<LoadUserAccount & SaveFacebookAccount>;
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
      crypto.generate.mockResolvedValue('any_generated_token');
   });

   beforeEach(() => {
      sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto);
   });

   it('should call LoadFacebookUser with correct params', async () => {
      await sut({ token });

      expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
      expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
   });

   it('should throw authentication error when LoadFacebookUser returns undefined', async () => {
      facebookApi.loadUser.mockResolvedValueOnce(undefined);
      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new AuthenticationError());
   });

   it('should call LoadUserAccountRepo when LoadFacebookUser returns data', async () => {
      await sut({ token: 'any token' });

      expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
      expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
   });

   it('should call SaveFacebookAccount with FacebookAccount', async () => {
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

      expect(crypto.generate).toHaveBeenCalledWith({
         key: 'any_account_id',
         expirationInMs: AccessToken.expirationInMs
      });
      expect(crypto.generate).toHaveBeenCalledTimes(1);
   });

   it('should return an AccessToken on success', async () => {
      const authResult = await sut({ token });

      expect(authResult).toEqual({ accessToken: 'any_generated_token' });
   });

   it('should rethrow if LoadFacebookUser throws', async () => {
      facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));

      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new Error('fb_error'));
   });

   it('should rethrow if LoadUserAccount throws', async () => {
      userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'));

      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new Error('load_error'));
   });

   it('should rethrow if SaveFacebookAccount throws', async () => {
      userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));

      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new Error('save_error'));
   });

   it('should rethrow if TokenGenerator throws', async () => {
      crypto.generate.mockRejectedValueOnce(new Error('generate_token_error'));

      const promise = sut({ token });

      await expect(promise).rejects.toThrow(new Error('generate_token_error'));
   });
});
