import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

import { getRepository} from "typeorm";

export class PgUserAccountRepository implements LoadUserAccountRepository {
   private readonly pgUserRepo = getRepository(PgUser);

   async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
      const pgUser = await this.pgUserRepo.findOne({ email: params.email });

      if(pgUser) {
         return {
            id: pgUser.id.toString(),
            name: pgUser.name ?? undefined
         };
      }
      return undefined;
   }

   async saveWithFacebook(params: SaveFacebookAccountRepository.Params): Promise<void> {
      if(params.id === undefined) {
         await this.pgUserRepo.save({
            email: params.email,
            name: params.name,
            facebookId: params.facebookId
         });
      }
      else {
         await this.pgUserRepo.update({
            id: parseInt(params.id)
         }, {
            name: params.name,
            facebookId: params.facebookId
         });
      }
   }
}
