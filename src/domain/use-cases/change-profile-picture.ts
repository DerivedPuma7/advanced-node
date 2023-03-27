import { UploadFile, UUIDGenerator } from "@/domain/contracts/gateways";
import { SaveUserPicture, LoadUserProfile } from "@/domain/contracts/repos";

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Input = { userId: string, file?: Buffer };

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo): ChangeProfilePicture => {
   return async ({ userId, file }): Promise<void> => {
      let pictureUrl: string | undefined = undefined;
      let initials: string | undefined = undefined;
      if(file) {
         pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) });
      } else {
         const { name } = await userProfileRepo.load({ id: userId });
         if(name) {
            const firstLetters = name.match(/\b(.)/g) ?? [];
            if(firstLetters.length > 1) {
               initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${firstLetters.pop()?.toUpperCase() ?? ''}`;
            } else {
               initials = name.substring(0, 2).toUpperCase();
            }
         }
      }
      await userProfileRepo.savePicture({ pictureUrl, initials });
   }
}
