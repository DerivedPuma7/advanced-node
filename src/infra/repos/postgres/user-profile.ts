import { SaveUserPicture, LoadUserProfile } from "@/domain/contracts/repos";
import { PgRepository } from "@/infra/repos/postgres";
import { PgUser } from "@/infra/repos/postgres/entities";

export class PgUserProfileRepository extends PgRepository implements SaveUserPicture, LoadUserProfile {
   async savePicture({ id, pictureUrl, initials }: SaveUserPicture.Input): Promise<void> {
      const pgUserRepo = this.getRepository(PgUser);
      await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials });
   }

   async load({ id }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
      const pgUserRepo = this.getRepository(PgUser);
      const user = await pgUserRepo.findOne({ id: parseInt(id) });
      if(user) return { name: user.name ?? undefined };
      return undefined;
   }
}
