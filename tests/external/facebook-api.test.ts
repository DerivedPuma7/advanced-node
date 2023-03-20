import { FacebookApi } from "@/infra/apis";
import { AxiosHttpClient } from "@/infra/http";
import { env } from "@/main/config/env";

describe('', () => {
   let axiosClient: AxiosHttpClient;
   let sut: FacebookApi;

   beforeEach(() => {
      axiosClient = new AxiosHttpClient();
      sut = new FacebookApi(
         axiosClient,
         env.facebookApi.clientId,
         env.facebookApi.clientSecret
      );
   });
   
   it('should return a facebook user if token is valid', async () => {
      const axiosClient = new AxiosHttpClient();
      const sut = new FacebookApi(
         axiosClient,
         env.facebookApi.clientId,
         env.facebookApi.clientSecret
      );

      const fbUser = await sut.loadUser({ token: 'EAAJ2IU147mIBAJez7mrTMpXCtXsOgokZAZBszZCfuPZCgkJ8bURLo6XP870tEaDUvoKUxtifzDZClXvj6VKvgBsX8K129gTP87P39XMwIC4s2jM5KSJkYOya38SgrQcyUjuEuGtguHi0HW1frHz9wDZAuxFtapKJtYko2ugZBCB5YLfEyZCtcdffYZBfl6fpH2G0rAHiZAUOygPi0iyu07EZC8x6aEVvfXZCbPRHePlU6mYw4pNpM8J4Srh6yF1QGKegDF49ryF05vzcsAZDZD' });

      expect(fbUser).toEqual({
         facebookId: '3290661811226038',
         name: 'Gustavo Figueiredo',
         email: 'gustavoribeiro665@hotmail.com'
      });
   });

   it('should return undefined if token is invalid', async () => {
      const fbUser = await sut.loadUser({ token: 'invalid_token' });

      expect(fbUser).toBeUndefined();
   });
});
