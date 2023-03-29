import { UploadFile, UUIDGenerator, DeleteFile } from "@/domain/contracts/gateways";
import { SaveUserPicture, LoadUserProfile } from "@/domain/contracts/repos";
import { UserProfile } from "@/domain/entities"

type Setup = (fileStorage: UploadFile & DeleteFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: Input) => Promise<Output>;
type Input = { userId: string, file?: Buffer };
type Output = {pictureUrl?: string, initials?: string};

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo): ChangeProfilePicture => {
   return async ({ userId, file }) => {
      const key = crypto.uuid({ key: userId });
      const data = {
         pictureUrl: file !== undefined ? await fileStorage.upload({ file, key }) : undefined,
         name: file === undefined ? (await userProfileRepo.load({ id: userId }))?.name : undefined
      };
      const userProfile = new UserProfile(userId);
      userProfile.setPicture(data);
      try{
         await userProfileRepo.savePicture(userProfile);
      } catch(error) {
         if(file !== undefined) await fileStorage.delete({ key });
         throw error;
      }
      return userProfile;
   }
}
