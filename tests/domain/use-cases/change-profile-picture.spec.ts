import { mock } from "jest-mock-extended";

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture;
type ChangeProfilePicture = (input: Input) => Promise<void>;
type Input = { userId: string, file: Buffer };

const setupChangeProfilePicture: Setup = (fileStorage, crypto): ChangeProfilePicture => {
   return async ({ userId, file }): Promise<void> => {
      await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) });
   }
}

interface UploadFile {
   upload: (input: UploadFile.Input) => Promise<void>;
}

namespace UploadFile {
   export type Input = { file: Buffer, key: string };
}

interface UUIDGenerator {
   uuid: (input: UUIDGenerator.Input) => UUIDGenerator.Output;
}

namespace UUIDGenerator {
   export type Input = { key: string };
   export type Output = string;
}

describe('ChangeProfilePicture', () => {
   it('should call UploadFile with correct params', async () => {
      const uuid = 'any_unique_id';
      const file = Buffer.from('any_buffer');
      const fileStorage = mock<UploadFile>();
      const crypto = mock<UUIDGenerator>();
      crypto.uuid.mockReturnValue(uuid);
      const sut = setupChangeProfilePicture(fileStorage, crypto);

      await sut({ userId: 'any_id', file });

      expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
      expect(fileStorage.upload).toHaveBeenCalledTimes(1);
   });
});
