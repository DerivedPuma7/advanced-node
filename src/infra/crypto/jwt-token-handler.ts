import { TokenGenerator, TokenValidator } from "@/domain/contracts/gateways";

import jwt, { JwtPayload } from 'jsonwebtoken';

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
   constructor(private readonly secret: string) { }

   async generate({ key, expirationInMs }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
      const expirationInSeconds = expirationInMs / 1000;
      return jwt.sign({ key: key }, this.secret, { expiresIn: expirationInSeconds });
   }

   async validate({ token }: TokenValidator.Params): Promise<TokenValidator.Result> {
      const payload = jwt.verify(token, this.secret) as JwtPayload;
      return payload.key;
   }
}
