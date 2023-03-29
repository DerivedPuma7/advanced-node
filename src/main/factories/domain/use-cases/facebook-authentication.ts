import { setupFacebookAuthentication, FacebookAuthentication } from "@/domain/use-cases";
import { makeFacebookApi, makeJwtTokenHandler } from "@/main/factories/gateways";
import { makePgUserAccountRepository } from "@/main/factories/repos";

export const makeFacebookAuthentication = (): FacebookAuthentication => {
   const facebookApi = makeFacebookApi();
   const pgUserAccountRepository = makePgUserAccountRepository();
   const JwtTokenHandler = makeJwtTokenHandler();

   return setupFacebookAuthentication(
      facebookApi,
      pgUserAccountRepository,
      JwtTokenHandler
   );
};
