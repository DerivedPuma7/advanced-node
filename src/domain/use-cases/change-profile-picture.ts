import { UploadFile, UUIDGenerator } from "@/domain/contracts/gateways";
import { SaveUserPicture, LoadUserProfile } from "@/domain/contracts/repos";

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Input = { userId: string, file?: Buffer };

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo): ChangeProfilePicture => {
   return async ({ userId, file }): Promise<void> => {
      let pictureUrl: string | undefined = undefined;
      if(file) {
         pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) });
      } else {
         await userProfileRepo.load({ id: userId });
      }
      await userProfileRepo.savePicture({ pictureUrl });
   }
}
