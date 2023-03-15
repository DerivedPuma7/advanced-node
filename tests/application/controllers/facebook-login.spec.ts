import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { mock, MockProxy } from "jest-mock-extended";
import { before } from "node:test";

class FacebookLoginController {
   constructor(private readonly facebookAuthentication: FacebookAuthentication){}
   async handle(httpRequest: any): Promise<HttpResponse> {
      if(httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
         return {
            statusCode: 400,
            data: new Error('The field token is required')
         };
      }

      const result = await this.facebookAuthentication.perform({ token: httpRequest.token });
      return {
         statusCode: 401,
         data: result
      };
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

   it('should call FacebookAuthentication with correct params', async () => {
      await sut.handle({ token: 'any_token' });

      expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token: 'any_token' });
      expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1);
   });
});
