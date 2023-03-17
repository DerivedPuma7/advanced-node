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
   
   /**
    * Teste não desenvolvido
    * Motivo: serviço do facebook developers não me permitiu criar usuários de teste
    */
   // it('should return a facebook user if token is valid', async () => {
   //    const axiosClient = new AxiosHttpClient();
   //    const sut = new FacebookApi(
   //       axiosClient,
   //       env.facebookApi.clientId,
   //       env.facebookApi.clientSecret
   //    );

   //    const fbUser = await sut.loadUser({ token: '' });

   //    expect(fbUser).toEqual({
   //       facebookId: '',
   //       name: '',
   //       email: ''
   //    });
   // });

   it('should return undefined if token is invalid', async () => {
      const fbUser = await sut.loadUser({ token: 'invalid_token' });

      expect(fbUser).toBeUndefined();
   });
});
