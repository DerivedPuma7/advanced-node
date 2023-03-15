import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import { FacebookLoginController } from "@/application/controllers";
import { ServerError } from "@/application/errors";

import { mock, MockProxy } from "jest-mock-extended";

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
