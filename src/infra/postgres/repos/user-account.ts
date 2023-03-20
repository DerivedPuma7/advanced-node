import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

import { getRepository} from "typeorm";

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
   async load({ email }: LoadParams): Promise<LoadResult> {
      const pgUserRepo = getRepository(PgUser);
      const pgUser = await pgUserRepo.findOne({ email: email });

      if(pgUser) {
         return {
            id: pgUser.id.toString(),
            name: pgUser.name ?? undefined
         };
      }
      return undefined;
   }

   async saveWithFacebook({ id, name, email, facebookId }: SaveParams): Promise<SaveResult> {
      const pgUserRepo = getRepository(PgUser);
      let resultId: string;

      if(id === undefined) {
         const pgUser = await pgUserRepo.save({ email, name, facebookId });
         resultId = pgUser.id.toString();
      }
      else {
         await pgUserRepo.update(
            { id: parseInt(id) },
            { name, facebookId }
         );
         resultId = id;
      }

      return { id: resultId };
   }
}
