import { FacebookAuthentication } from "@/domain/features";

class FacebookAuthenticationService {
   constructor(
      private readonly loadFacebookUserApi: LoadFacebookUserApi
   ){

   }
   async perform(params: FacebookAuthentication.Params): Promise<void> {
      await this.loadFacebookUserApi.loadUser(params);
   }
}

interface LoadFacebookUserApi {
   loadUser: (params: LoadFacebookUserApi.params) => Promise<void>;
}

namespace LoadFacebookUserApi {
   export type params = {
      token: string
   }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
   token?: string;

   async loadUser(params: LoadFacebookUserApi.params): Promise<void> {
      this.token = params.token;
   }
}

describe('FacebookAuthenticationService', () => {
   it('should call LoadFacebookUserApi with correct params', async () => {
      const loadFacebookUserApi = new LoadFacebookUserApiSpy();
      const sut = new FacebookAuthenticationService(loadFacebookUserApi);

      await sut.perform({ token: 'any token' });

      expect(loadFacebookUserApi.token).toBe('any token');
   });
});
