import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken } from "@/domain/entities";
import { FacebookLoginController } from "@/application/controllers";
import { UnauthorizedError } from "@/application/errors";
import { RequiredStringValidator } from "@/application/validation";

describe('FacebookLoginController', () => {
   let sut: FacebookLoginController;
   let facebookAuthentication: jest.Mock;
   let token: string;

   beforeAll(() => {
      facebookAuthentication = jest.fn();
      facebookAuthentication.mockResolvedValue(new AccessToken('any_value'));

      token = 'any_token';
   });

   beforeEach(() => {
      sut = new FacebookLoginController(facebookAuthentication);
   });

   it('should build Validator correctly', async () => {
      const validators = sut.buildValidators({ token });

      expect(validators).toEqual([
         new RequiredStringValidator('any_token', 'token')
      ]);
   });

   it('should return 401 if authetication fails', async () => {
      facebookAuthentication.mockResolvedValueOnce(new AuthenticationError());
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
