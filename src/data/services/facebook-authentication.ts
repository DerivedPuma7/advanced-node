import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos";
import { AccessToken, FacebookAccount } from "@/domain/models";
import { TokenGenerator } from "../contracts/crypto";

export class FacebookAuthenticationService implements FacebookAuthentication {
   constructor(
      private readonly facebookApi: LoadFacebookUserApi,
      private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
      private readonly crypto: TokenGenerator
   ){

   }
   async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
      const fbReturnData = await this.facebookApi.loadUser(params);

      if(fbReturnData !== undefined) {
         const accountData = await this.userAccountRepo.load({ email: fbReturnData.email });
         const facebookAccount = new FacebookAccount(fbReturnData, accountData);

         const { id } = await this.userAccountRepo.saveWithFacebook(facebookAccount);
         const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs });

         return new AccessToken(token);
      }
      return new AuthenticationError();
   }
}
