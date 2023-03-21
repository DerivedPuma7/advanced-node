import { FacebookAuthenticationService } from "@/domain/services";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepository } from "@/main/factories/repos";
import { makeJwtTokenGenerator } from "@/main/factories/crypto";

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
   const facebookApi = makeFacebookApi();
   const pgUserAccountRepository = makePgUserAccountRepository();
   const jwtTokenGenerator = makeJwtTokenGenerator();

   return new FacebookAuthenticationService(
      facebookApi,
      pgUserAccountRepository,
      jwtTokenGenerator
   );
};
