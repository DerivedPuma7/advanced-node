import { FacebookAuthenticationUseCase } from "@/domain/use-cases";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepository } from "@/main/factories/repos";
import { makeJwtTokenGenerator } from "@/main/factories/crypto";

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
   const facebookApi = makeFacebookApi();
   const pgUserAccountRepository = makePgUserAccountRepository();
   const jwtTokenGenerator = makeJwtTokenGenerator();

   return new FacebookAuthenticationUseCase(
      facebookApi,
      pgUserAccountRepository,
      jwtTokenGenerator
   );
};
