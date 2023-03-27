import { UploadFile, UUIDGenerator } from "@/domain/contracts/gateways";
import { ChangeProfilePicture, setupChangeProfilePicture } from "@/domain/use-cases"
import { SaveUserPicture, LoadUserProfile } from "@/domain/contracts/repos";

import { mock, MockProxy } from "jest-mock-extended";

describe('ChangeProfilePicture', () => {
   let uuid: string;
   let file: Buffer;
   let fileStorage: MockProxy<UploadFile>;
   let crypto: MockProxy<UUIDGenerator>;
   let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>;
   let sut: ChangeProfilePicture;

   beforeAll(() => {
      uuid = 'any_unique_id';
      file = Buffer.from('any_buffer');
      fileStorage = mock();
      fileStorage.upload.mockResolvedValue('any_url');
      crypto = mock();
      userProfileRepo = mock();
      userProfileRepo.load.mockResolvedValue({ name: 'Gustavo Ribeiro de Figueiredo' });
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

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined });
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });

   it('should call SavePicture with correct input when file is undefined', async () => {
      await sut({ userId: 'any_id', file: undefined });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'GF' });
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });

   it('should call SavePicture with correct initials if letters are lowercased', async () => {
      userProfileRepo.load.mockResolvedValueOnce({ name: 'gustavo ribeiro de figueiredo' });
      await sut({ userId: 'any_id', file: undefined });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'GF' });
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });

   it('should call SavePicture with correct initials if user does not have full name', async () => {
      userProfileRepo.load.mockResolvedValueOnce({ name: 'gustavo' });
      await sut({ userId: 'any_id', file: undefined });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'GU' });
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });

   it('should call SavePicture with correct initials if user has name with only one letter', async () => {
      userProfileRepo.load.mockResolvedValueOnce({ name: 'g' });
      await sut({ userId: 'any_id', file: undefined });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'G' });
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });

   it('should call SavePicture with correct initials if user does not have a name', async () => {
      userProfileRepo.load.mockResolvedValueOnce({ name: undefined });
      await sut({ userId: 'any_id', file: undefined });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined });
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });

   it('should call LoadUserProfile with correct input', async () => {
      await sut({ userId: 'any_id', file: undefined });

      expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_id' });
      expect(userProfileRepo.load).toHaveBeenCalledTimes(1);
   });

   it('should not call LoadUserProfile if file exists', async () => {
      await sut({ userId: 'any_id', file });

      expect(userProfileRepo.load).not.toHaveBeenCalled();
   });
});
