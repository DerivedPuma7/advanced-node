import { setupFacebookAuthentication, FacebookAuthentication } from "@/domain/use-cases";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepository } from "@/main/factories/repos";
import { makeJwtTokenHandler } from "@/main/factories/crypto";

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
