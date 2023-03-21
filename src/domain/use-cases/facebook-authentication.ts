import { LoadFacebookUserApi } from "@/domain/contracts/apis";
import { AuthenticationError } from "@/domain/entities/errors";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/domain/contracts/repos";
import { AccessToken, FacebookAccount } from "@/domain/entities";
import { TokenGenerator } from "@/domain/contracts/crypto";

type Setup = (
   facebookApi: LoadFacebookUserApi,
   userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
   crypto: TokenGenerator
) => FacebookAuthentication;

export type FacebookAuthentication = (
   params: { token: string }
) => Promise<AccessToken | AuthenticationError>;

export const setupFacebookAuthentication: Setup = (
      facebookApi,
      userAccountRepo,
      crypto
   ): FacebookAuthentication => {
      return async params => {
         const fbReturnData = await facebookApi.loadUser(params);

         if (fbReturnData !== undefined) {
            const accountData = await userAccountRepo.load({ email: fbReturnData.email });
            const facebookAccount = new FacebookAccount(fbReturnData, accountData);

            const { id } = await userAccountRepo.saveWithFacebook(facebookAccount);
            const token = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs });

            return new AccessToken(token);
         }
         return new AuthenticationError();
      }
   }



