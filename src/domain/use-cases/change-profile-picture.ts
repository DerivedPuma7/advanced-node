import { UploadFile, UUIDGenerator } from "@/domain/contracts/gateways";
import { SaveUserPicture, LoadUserProfile } from "@/domain/contracts/repos";
import { UserProfile } from "@/domain/entities"

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Input = { userId: string, file?: Buffer };

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo): ChangeProfilePicture => {
   return async ({ userId, file }): Promise<void> => {
      const data: {pictureUrl?: string, name?: string} = {};
      if(file) {
         data.pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) });
      } else {
         data.name = (await userProfileRepo.load({ id: userId })).name;
      }
      const userProfile = new UserProfile(userId);
      userProfile.setPicture(data);
      await userProfileRepo.savePicture(userProfile);
   }
}
