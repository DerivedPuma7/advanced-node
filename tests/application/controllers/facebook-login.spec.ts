import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import { mock, MockProxy } from "jest-mock-extended";

class FacebookLoginController {
   constructor(private readonly facebookAuthentication: FacebookAuthentication){}
   async handle(httpRequest: any): Promise<HttpResponse> {
      try {
         if(httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
            return {
               statusCode: 400,
               data: new Error('The field token is required')
            };
         }

         const result = await this.facebookAuthentication.perform({ token: httpRequest.token });
         if(result instanceof AccessToken) {
            return {
               statusCode: 200,
               data: {
                  accessToken: result.value
               }
            }
         }

         return {
            statusCode: 401,
            data: result
         };
      } catch (error: any) {
         return {
            statusCode: 500,
            data: new ServerError(error)
         };
      }
   }
}

class ServerError extends Error {
   constructor(error?: Error) {
      super('Server failed, try again soon');
      this.name = 'ServerError';
      this.stack = error?.stack;
   }
}

type HttpResponse = {
   statusCode: number,
   data: any
};

describe('FacebookLoginController', () => {
   let sut: FacebookLoginController;
   let facebookAuthentication: MockProxy<FacebookAuthentication>;

   beforeAll(() => {
      facebookAuthentication = mock();

      facebookAuthentication.perform.mockResolvedValue(new AccessToken('any_value'));
   });

   beforeEach(() => {
      sut = new FacebookLoginController(facebookAuthentication);
   });

   it('should return 400 if token is empty', async () => {
      const httpResponse = await sut.handle({ token: '' });

      expect(httpResponse).toEqual({
         statusCode: 400,
         data: new Error('The field token is required')
      });
   });

   it('should return 400 if token is empty', async () => {
      const httpResponse = await sut.handle({ token: null });

      expect(httpResponse).toEqual({
         statusCode: 400,
         data: new Error('The field token is required')
      });
   });

   it('should return 400 if token is empty', async () => {
      const httpResponse = await sut.handle({ token: undefined });

      expect(httpResponse).toEqual({
         statusCode: 400,
         data: new Error('The field token is required')
      });
   });

   it('should return 401 if authetication fails', async () => {
      facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError());
      const httpResponse = await sut.handle({ token: 'any_token' });

      expect(httpResponse).toEqual({
         statusCode: 401,
         data: new AuthenticationError()
      });
   });

   it('should return 200 if authetication succeeds', async () => {
      const httpResponse = await sut.handle({ token: 'any_token' });

      expect(httpResponse).toEqual({
         statusCode: 200,
         data: {
            accessToken: 'any_value'
         }
      });
   });

   it('should return 500 if authetication throws', async () => {
      const error = new Error('infra_error');
      facebookAuthentication.perform.mockRejectedValueOnce(error);
      const httpResponse = await sut.handle({ token: 'any_token' });

      expect(httpResponse).toEqual({
         statusCode: 500,
         data: new ServerError(error)
      });
   });

   it('should call FacebookAuthentication with correct params', async () => {
      await sut.handle({ token: 'any_token' });

      expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token: 'any_token' });
      expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1);
   });
});
