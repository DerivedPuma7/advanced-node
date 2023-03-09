import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from "@/data/contracts/repos";

export class FacebookAuthenticationService implements FacebookAuthentication {
   constructor(
      private readonly facebookApi: LoadFacebookUserApi,
      private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
   ){

   }
   async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
      const fbReturnData = await this.facebookApi.loadUser(params);

      if(fbReturnData !== undefined) {
         const accountData = await this.userAccountRepo.load({ email: fbReturnData.email });

         if(accountData !== undefined) {
            await this.userAccountRepo.updateWithFacebook({
               id: accountData.id,
               name: accountData.name ?? fbReturnData.name,
               facebookId: fbReturnData.facebookId
            });
         }
         else {
            await this.userAccountRepo.createFromFacebook(fbReturnData);
         }

      }
      return new AuthenticationError();
   }
}
