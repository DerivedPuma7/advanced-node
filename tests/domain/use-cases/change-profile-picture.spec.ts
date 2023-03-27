import { UploadFile, UUIDGenerator } from "@/domain/contracts/gateways";
import { ChangeProfilePicture, setupChangeProfilePicture } from "@/domain/use-cases"

import { mock, MockProxy } from "jest-mock-extended";

describe('ChangeProfilePicture', () => {
   let uuid: string;
   let file: Buffer;
   let fileStorage: MockProxy<UploadFile>;
   let crypto: MockProxy<UUIDGenerator>;
   let sut: ChangeProfilePicture;

   beforeAll(() => {
      uuid = 'any_unique_id';
      file = Buffer.from('any_buffer');
      fileStorage = mock<UploadFile>();
      crypto = mock<UUIDGenerator>();
      crypto.uuid.mockReturnValue(uuid);
   });

   beforeEach(() => {
      sut = setupChangeProfilePicture(fileStorage, crypto);
   });

   it('should call UploadFile with correct params', async () => {
      await sut({ userId: 'any_id', file });

      expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
      expect(fileStorage.upload).toHaveBeenCalledTimes(1);
   });
});
