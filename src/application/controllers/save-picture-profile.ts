import { ok, HttpResponse } from "@/application/helpers";
import { ChangeProfilePicture } from "@/domain/use-cases";
import { Controller } from "@/application/controllers";
import { ValidationBuilder, Validator } from "@/application/validation";

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string };
type Model = Error | { initials?: string, pictureUrl?: string };

export class SavePictureController extends Controller {
   constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
      super();
   }

   async perform({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
      const data = await this.changeProfilePicture({ userId, file: file.buffer });
      return ok(data);
   }

   override buildValidators({ file }: any): Validator[] {
      return [
         ... ValidationBuilder.of({ value: file, fieldName: 'file' })
            .required()
            .image({ allowed: ['jpg', 'png'], maxSizeInMb: 5 })
            .build()
      ]
   }
}
