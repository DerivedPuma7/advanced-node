import { FacebookLoginController } from "@/application/controllers";
import { makeFacebookAuthentication } from "@/main/factories/use-cases";

export const makeFacebookLoginController = (): FacebookLoginController => {
   const facebookAuthenticationUseCase = makeFacebookAuthentication();
   return new FacebookLoginController(facebookAuthenticationUseCase);
};
