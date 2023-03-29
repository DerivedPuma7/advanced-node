import { Controller } from "@/application/controllers";
import { ChangeProfilePicture } from "@/domain/use-cases";

type HttpRequest = { userId: string };

class DeletePictureController {
   constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}

   async handle({ userId }: HttpRequest): Promise<void> {
      await this.changeProfilePicture({ userId })
   }
}

describe('DeletePictureController', () => {
   let sut: DeletePictureController;
   let changeProfilePicture: jest.Mock;

   beforeAll(() => {
      changeProfilePicture = jest.fn();
   });

   beforeEach(() => {
      sut = new DeletePictureController(changeProfilePicture);
   });

   it('should call ChangeProfilePicture with correct input', async () => {
      await sut.handle({ userId: 'any_user_id' });

      expect(changeProfilePicture).toHaveBeenCalledWith({ userId: 'any_user_id' });
      expect(changeProfilePicture).toHaveBeenCalledTimes(1);
   });
});
