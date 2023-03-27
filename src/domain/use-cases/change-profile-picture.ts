import { UploadFile, UUIDGenerator } from "@/domain/contracts/gateways";
import { SaveUserPicture } from "@/domain/contracts/repos";

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Input = { userId: string, file?: Buffer };

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo): ChangeProfilePicture => {
   return async ({ userId, file }): Promise<void> => {
      let pictureUrl: string | undefined = undefined;
      if(file) {
         pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) });
      }
      await userProfileRepo.savePicture({ pictureUrl });
   }
}
