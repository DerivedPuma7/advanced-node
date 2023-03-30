import { AuthenticationError } from "@/domain/entities/errors";
import { Controller, FacebookLoginController } from "@/application/controllers";
import { UnauthorizedError } from "@/application/errors";
import { RequiredString } from "@/application/validation";

describe('FacebookLoginController', () => {
   let sut: FacebookLoginController;
   let facebookAuthentication: jest.Mock;
   let token: string;

   beforeAll(() => {
      facebookAuthentication = jest.fn();
      facebookAuthentication.mockResolvedValue({ accessToken: 'any_value' });

      token = 'any_token';
   });

   beforeEach(() => {
      sut = new FacebookLoginController(facebookAuthentication);
   });

   it('should extend Controller', async () => {
      expect(sut).toBeInstanceOf(Controller);
   });

   it('should build Validator correctly', async () => {
      const validators = sut.buildValidators({ token });

      expect(validators).toEqual([
         new RequiredString('any_token', 'token')
      ]);
   });

   it('should return 401 if authetication fails', async () => {
      facebookAuthentication.mockRejectedValueOnce(new AuthenticationError());

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

   it('should call FacebookAuthentication with correct params', async () => {
      await sut.handle({ token });

      expect(facebookAuthentication).toHaveBeenCalledWith({ token: 'any_token' });
      expect(facebookAuthentication).toHaveBeenCalledTimes(1);
   });
});
