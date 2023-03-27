import { UploadFile, UUIDGenerator } from "@/domain/contracts/gateways";
import { ChangeProfilePicture, setupChangeProfilePicture } from "@/domain/use-cases"
import { SaveUserPicture } from "@/domain/contracts/repos";

import { mock, MockProxy } from "jest-mock-extended";

describe('ChangeProfilePicture', () => {
   let uuid: string;
   let file: Buffer;
   let fileStorage: MockProxy<UploadFile>;
   let crypto: MockProxy<UUIDGenerator>;
   let userProfileRepo: MockProxy<SaveUserPicture>;
   let sut: ChangeProfilePicture;

   beforeAll(() => {
      uuid = 'any_unique_id';
      file = Buffer.from('any_buffer');
      fileStorage = mock();
      fileStorage.upload.mockResolvedValue('any_url');
      crypto = mock();
      userProfileRepo = mock();
      crypto.uuid.mockReturnValue(uuid);
   });

   beforeEach(() => {
      sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo);
   });

   it('should call UploadFile with correct params', async () => {
      await sut({ userId: 'any_id', file });

      expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
      expect(fileStorage.upload).toHaveBeenCalledTimes(1);
   });

   it('should not call UploadFile if file is undefined', async () => {
      await sut({ userId: 'any_id', file: undefined });

      expect(fileStorage.upload).not.toHaveBeenCalled();
   });

   it('should call SavePicture with correct input', async () => {
      await sut({ userId: 'any_id', file });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url' });
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });

   it('should call SavePicture with correct input when file is undefined', async () => {
      await sut({ userId: 'any_id', file: undefined });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined });
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });
});
