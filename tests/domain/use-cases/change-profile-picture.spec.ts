import { UploadFile, UUIDGenerator, DeleteFile } from "@/domain/contracts/gateways";
import { ChangeProfilePicture, setupChangeProfilePicture } from "@/domain/use-cases"
import { SaveUserPicture, LoadUserProfile } from "@/domain/contracts/repos";
import { UserProfile } from "@/domain/entities";

import { mock, MockProxy } from "jest-mock-extended";

jest.mock('@/domain/entities/user-profile');

describe('ChangeProfilePicture', () => {
   let uuid: string;
   let buffer: Buffer;
   let mimeType: string;
   let file: { buffer: Buffer, mimeType: string };
   let fileStorage: MockProxy<UploadFile & DeleteFile>;
   let crypto: MockProxy<UUIDGenerator>;
   let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>;
   let sut: ChangeProfilePicture;

   beforeAll(() => {
      uuid = 'any_unique_id';
      buffer = Buffer.from('any_buffer');
      mimeType = 'image/png';
      file = { buffer, mimeType };
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
      await sut({ userId: 'any_id', file: { buffer, mimeType: 'image/png' } });

      expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.png` });
      expect(fileStorage.upload).toHaveBeenCalledTimes(1);
   });

   it('should call UploadFile with correct params', async () => {
      await sut({ userId: 'any_id', file: { buffer, mimeType: 'image/jpeg' } });

      expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.jpeg` });
      expect(fileStorage.upload).toHaveBeenCalledTimes(1);
   });

   it('should not call UploadFile if file is undefined', async () => {
      await sut({ userId: 'any_id', file: undefined });

      expect(fileStorage.upload).not.toHaveBeenCalled();
   });

   it('should call SavePicture with correct input', async () => {
      await sut({ userId: 'any_id', file });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith(jest.mocked(UserProfile).mock.instances[0]);
      expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   });

   /**
    * 27/03/2023
    * Teste exatamente igual ao acima, está comentado por que estou aguardando resposta do instrutor do curso
    */
   // it('should call SavePicture with correct input - teste', async () => {
   //    const UserProfileStub = jest.fn().mockImplementationOnce(() => {
   //       return {
   //          pictureUrl: 'any_url',
   //          setPicture: jest.fn().mockImplementationOnce(() => {
   //             return jest.fn()
   //          })
   //       }
   //    });
   //    jest.mocked(UserProfile).mockImplementation(UserProfileStub);

   //    await sut({ userId: 'any_id', file });

   //    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined });
   //    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
   // });

   it('should call SavePicture with correct input if load returns undefined', async () => {
      userProfileRepo.load.mockResolvedValueOnce(undefined);
      await sut({ userId: 'any_id', file });

      expect(userProfileRepo.savePicture).toHaveBeenCalledWith(jest.mocked(UserProfile).mock.instances[0]);
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

   /**
    * esse expect é um caso inválido, nunca teremos a pictureUrl e initials preenchidos
    * a ideia é garantir que o retorno do sut seja identico à entidade UserProfile
    */
   it('should return correct data on success', async () => {
      jest.mocked(UserProfile).mockImplementationOnce(id => ({
         setPicture: jest.fn(),
         id: 'any_id',
         pictureUrl: 'any_url',
         initials: 'any_initials'
      }));

      const result = await sut({ userId: 'any_id', file });

      expect(result).toMatchObject({
         pictureUrl: 'any_url',
         initials: 'any_initials'
      });
   });

   it('should call DeleteFile when file exists and SaveUserPicture throws', async () => {
      userProfileRepo.savePicture.mockRejectedValueOnce(new Error());
      expect.assertions(2);

      const promise = sut({ userId: 'any_id', file });

      promise.catch(() => {
         expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid });
         expect(fileStorage.delete).toHaveBeenCalledTimes(1);
      });
   });

   it('should not call DeleteFile when file does not exists and SaveUserPicture throws', async () => {
      userProfileRepo.savePicture.mockRejectedValueOnce(new Error());
      expect.assertions(1);

      const promise = sut({ userId: 'any_id', file: undefined });

      promise.catch(() => {
         expect(fileStorage.delete).not.toHaveBeenCalled();
      });
   });

   it('should rethrow if SaveUserPicture throws', async () => {
      const error = new Error('save_error');
      userProfileRepo.savePicture.mockRejectedValueOnce(error);

      const promise = sut({ userId: 'any_id', file });

      expect(promise).rejects.toThrow(error);
   });
});
