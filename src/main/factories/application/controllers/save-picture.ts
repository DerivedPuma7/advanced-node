import { SavePictureController } from "@/application/controllers";
import { makeChangeProfilePicture } from "@/main/factories/domain/use-cases";

export const makeSavePictureController = (): SavePictureController => {
   const changeProfilePicture = makeChangeProfilePicture();
   return new SavePictureController(changeProfilePicture);
};
