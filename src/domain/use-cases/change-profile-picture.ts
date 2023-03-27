import { UploadFile, UUIDGenerator } from "@/domain/contracts/gateways";

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Input = { userId: string, file?: Buffer };

export const setupChangeProfilePicture: Setup = (fileStorage, crypto): ChangeProfilePicture => {
   return async ({ userId, file }): Promise<void> => {
      if(file) {
         await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) });
      }
   }
}
