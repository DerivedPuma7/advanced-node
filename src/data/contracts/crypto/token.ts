export interface TokenGenerator {
   generateToken: (Params: TokenGenerator.Params) => Promise<void>
}

export namespace TokenGenerator {
   export type Params = {
      key: string
   }
}
