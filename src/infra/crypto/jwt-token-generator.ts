import { TokenGenerator } from "@/domain/contracts/crypto";

import jwt from 'jsonwebtoken';

type Params = TokenGenerator.Params;
type Result = TokenGenerator.Result;

export class JwtTokenGenerator implements TokenGenerator {
   constructor(private readonly secret: string) { }

   async generateToken({ key, expirationInMs }: Params): Promise<Result> {
      const expirationInSeconds = expirationInMs / 1000;
      return jwt.sign({ key: key }, this.secret, { expiresIn: expirationInSeconds });
   }
}
