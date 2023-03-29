import { Controller, DeletePictureController } from "@/application/controllers";

describe('DeletePictureController', () => {
   let sut: DeletePictureController;
   let changeProfilePicture: jest.Mock;

   beforeAll(() => {
      changeProfilePicture = jest.fn();
   });

   beforeEach(() => {
      sut = new DeletePictureController(changeProfilePicture);
   });

   it('should extend Controller', async () => {
      expect(sut).toBeInstanceOf(Controller);
   });

   it('should call ChangeProfilePicture with correct input', async () => {
      await sut.handle({ userId: 'any_user_id' });

      expect(changeProfilePicture).toHaveBeenCalledWith({ userId: 'any_user_id' });
      expect(changeProfilePicture).toHaveBeenCalledTimes(1);
   });

   it('should return 204', async () => {
      const httpResponse = await sut.handle({ userId: 'any_user_id' });

      expect(httpResponse).toEqual({
         statusCode: 204,
         data: null
      });
   });
});
