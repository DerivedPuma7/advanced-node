import { LoadUserAccountRepository } from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

import { getRepository} from "typeorm";

export class PgUserAccountRepository implements LoadUserAccountRepository {
   async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
      const pgUserRepo = getRepository(PgUser);
      const pgUser = await pgUserRepo.findOne({ where: { email: params.email }});

      if(pgUser) {
         return {
            id: pgUser.id.toString(),
            name: pgUser.name ?? undefined
         };
      }
      return undefined;
   }
}
