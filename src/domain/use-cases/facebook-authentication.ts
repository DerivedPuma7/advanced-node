import { LoadFacebookUser, TokenGenerator } from "@/domain/contracts/gateways";
import { LoadUserAccount, SaveFacebookAccount } from "@/domain/contracts/repos";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";

type Setup = (
   facebook: LoadFacebookUser,
   userAccountRepo: LoadUserAccount & SaveFacebookAccount,
   token: TokenGenerator
) => FacebookAuthentication;

type Input = { token: string };
type Output = { accessToken: string };
export type FacebookAuthentication = (params: Input) => Promise<Output>;

export const setupFacebookAuthentication: Setup = (
   facebook,
   userAccountRepo,
   token
): FacebookAuthentication => {
   return async params => {
      const fbReturnData = await facebook.loadUser(params);

      if (fbReturnData !== undefined) {
         const accountData = await userAccountRepo.load({ email: fbReturnData.email });
         const facebookAccount = new FacebookAccount(fbReturnData, accountData);

         const { id } = await userAccountRepo.saveWithFacebook(facebookAccount);
         const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs });
         return { accessToken }
      }
      throw new AuthenticationError();
   }
}



