import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadUserAccountRepository } from "../contracts/repos";

export class FacebookAuthenticationService implements FacebookAuthentication {
   constructor(
      private readonly loadFacebookUserApi: LoadFacebookUserApi,
      private readonly loadUserAccountRepo: LoadUserAccountRepository
   ){

   }
   async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
      const fbReturnData = await this.loadFacebookUserApi.loadUser(params);

      if(fbReturnData !== undefined) {
         await this.loadUserAccountRepo.load({ email: fbReturnData.email })
      }
      return new AuthenticationError();
   }
}
