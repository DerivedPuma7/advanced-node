import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import { FacebookLoginController } from "@/application/controllers";
import { ServerError, UnauthorizedError } from "@/application/errors";
import { RequiredStringValidator } from "@/application/validation";

import { mock, MockProxy } from "jest-mock-extended";

jest.mock('@/application/validation/required-string');

describe('FacebookLoginController', () => {
   let sut: FacebookLoginController;
   let facebookAuthentication: MockProxy<FacebookAuthentication>;
   let token: string;

   beforeAll(() => {
      facebookAuthentication = mock();
      facebookAuthentication.perform.mockResolvedValue(new AccessToken('any_value'));

      token = 'any_token';
   });

   beforeEach(() => {
      sut = new FacebookLoginController(facebookAuthentication);
   });

   it('should return 400 if validation fails', async () => {
      const error = new Error('validation error');
      const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
         validate: jest.fn().mockReturnValueOnce(error)
      }));
      jest.mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy)

      const httpResponse = await sut.handle({ token });

      expect(RequiredStringValidator).toHaveBeenCalledWith('any_token', 'token');
      expect(httpResponse).toEqual({
         statusCode: 400,
         data: error
      });
   });

   it('should return 401 if authetication fails', async () => {
      facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError());
      const httpResponse = await sut.handle({ token });

      expect(httpResponse).toEqual({
         statusCode: 401,
         data: new UnauthorizedError()
      });
   });

   it('should return 200 if authetication succeeds', async () => {
      const httpResponse = await sut.handle({ token });

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
      const httpResponse = await sut.handle({ token });

      expect(httpResponse).toEqual({
         statusCode: 500,
         data: new ServerError(error)
      });
   });

   it('should call FacebookAuthentication with correct params', async () => {
      await sut.handle({ token });

      expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token: 'any_token' });
      expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1);
   });
});
