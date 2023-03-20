import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

import { getRepository} from "typeorm";

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
   private readonly pgUserRepo = getRepository(PgUser);

   async load({ email }: LoadParams): Promise<LoadResult> {
      const pgUser = await this.pgUserRepo.findOne({ email: email });

      if(pgUser) {
         return {
            id: pgUser.id.toString(),
            name: pgUser.name ?? undefined
         };
      }
      return undefined;
   }

   async saveWithFacebook({ id, name, email, facebookId }: SaveParams): Promise<SaveResult> {
      let resultId: string;

      if(id === undefined) {
         const pgUser = await this.pgUserRepo.save({ email, name, facebookId });
         resultId = pgUser.id.toString();
      }
      else {
         await this.pgUserRepo.update(
            { id: parseInt(id) },
            { name, facebookId }
         );
         resultId = id;
      }

      return { id: resultId };
   }
}
