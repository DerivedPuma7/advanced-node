import { DeletePictureController } from "@/application/controllers";
import { makeChangeProfilePicture } from "@/main/factories/domain/use-cases";

export const makeDeletePictureController = (): DeletePictureController => {
   const changeProfilePicture = makeChangeProfilePicture();
   return new DeletePictureController(changeProfilePicture);
};
