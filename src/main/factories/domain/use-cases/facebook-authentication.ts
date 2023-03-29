import { setupFacebookAuthentication, FacebookAuthentication } from "@/domain/use-cases";
import { makeFacebookApi, makeJwtTokenHandler } from "@/main/factories/infra/gateways";
import { makePgUserAccountRepository } from "@/main/factories/infra/repos";

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
