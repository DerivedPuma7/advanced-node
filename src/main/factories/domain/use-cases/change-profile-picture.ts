import { ChangeProfilePicture, setupChangeProfilePicture } from "@/domain/use-cases";
import { makeAwsS3FileStorage, makeUuidHandler, makeUniqueId } from "@/main/factories/infra/gateways/";
import { makePgUserProfileRepository } from "@/main/factories/infra/repos";

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
   const fileStorage = makeAwsS3FileStorage();
   const uuidHandler = makeUniqueId();
   const profileRepo = makePgUserProfileRepository()

   return setupChangeProfilePicture(fileStorage, uuidHandler, profileRepo);
};
