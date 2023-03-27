export interface SaveUserPicture {
   savePicture: (params: SaveUserPicture.Input) => Promise<void>;
}

export namespace SaveUserPicture {
   export type Input = { pictureUrl: string }
}
