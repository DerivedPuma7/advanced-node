import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";

import { mock, MockProxy } from "jest-mock-extended";

type SutTypes = {
   sut: FacebookAuthenticationService,
   loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
};

const makeSut = (): SutTypes => {
   const loadFacebookUserApi = mock<LoadFacebookUserApi>();
   const sut = new FacebookAuthenticationService(loadFacebookUserApi);

   return {
      sut,
      loadFacebookUserApi
   };
}

describe('FacebookAuthenticationService', () => {
   it('should call LoadFacebookUserApi with correct params', async () => {
      const { sut, loadFacebookUserApi } = makeSut();

      await sut.perform({ token: 'any token' });

      expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any token' });
      expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
   });

   it('should return authentication error when LoadFacebookUserApi returns undefined', async () => {
      const { sut, loadFacebookUserApi } = makeSut();
      loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

      const authResult = await sut.perform({ token: 'any token' });

      expect(authResult).toEqual(new AuthenticationError());
   });
});
