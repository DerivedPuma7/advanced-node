import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos";

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

         await this.userAccountRepo.saveWithFacebook({
            id: accountData?.id,
            name: accountData?.name ?? fbReturnData.name,
            email: fbReturnData.email,
            facebookId: fbReturnData.facebookId
         });

      }
      return new AuthenticationError();
   }
}
