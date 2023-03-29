import { SaveUserPicture, LoadUserProfile } from "@/domain/contracts/repos";
import { PgUser } from "@/infra/repos/postgres/entities";

import { getRepository } from "typeorm";

export class PgUserProfileRepository implements SaveUserPicture, LoadUserProfile {
   async savePicture({ id, pictureUrl, initials }: SaveUserPicture.Input): Promise<void> {
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials });
   }

   async load({ id }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
      const pgUserRepo = getRepository(PgUser);
      const user = await pgUserRepo.findOne({ id: parseInt(id) });
      if(user) return { name: user.name };
      return undefined;
   }
}
