import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from "@/data/contracts/repos";

export class FacebookAuthenticationService implements FacebookAuthentication {
   constructor(
      private readonly facebookApi: LoadFacebookUserApi,
      private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository
   ){

   }
   async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
      const fbReturnData = await this.facebookApi.loadUser(params);

      if(fbReturnData !== undefined) {
         await this.userAccountRepo.load({ email: fbReturnData.email });
         await this.userAccountRepo.createFromFacebook(fbReturnData);
      }
      return new AuthenticationError();
   }
}
