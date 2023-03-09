import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos";
import { FacebookAccount } from "@/domain/models";

export class FacebookAuthenticationService implements FacebookAuthentication {
   constructor(
      private readonly facebookApi: LoadFacebookUserApi,
      private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository
   ){

   }
   async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
      const fbReturnData = await this.facebookApi.loadUser(params);

      if(fbReturnData !== undefined) {
         const accountData = await this.userAccountRepo.load({ email: fbReturnData.email });
         const facebookAccount = new FacebookAccount(fbReturnData, accountData);

         await this.userAccountRepo.saveWithFacebook(facebookAccount);

      }
      return new AuthenticationError();
   }
}
