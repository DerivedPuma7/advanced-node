import { mock } from "jest-mock-extended";

type Setup = (fileStorage: UploadFile) => ChangeProfilePicture;
type ChangeProfilePicture = (input: Input) => Promise<void>;
type Input = { userId: string, file: Buffer };

const setupChangeProfilePicture: Setup = (fileStorage): ChangeProfilePicture => {
   return async ({ userId, file }): Promise<void> => {
      await fileStorage.upload({ file, key: userId });
   }
}

interface UploadFile {
   upload: (input: UploadFile.Input) => Promise<void>;
}

namespace UploadFile {
   export type Input = { file: Buffer, key: string };
}

describe('ChangeProfilePicture', () => {
   it('should call UploadFile with correct params', async () => {
      const file = Buffer.from('any_buffer');
      const fileStorage = mock<UploadFile>();
      const sut = setupChangeProfilePicture(fileStorage);

      await sut({ userId: 'any_id', file });

      expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' });
      expect(fileStorage.upload).toHaveBeenCalledTimes(1);
   });
});
