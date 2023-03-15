export class AccessToken {
   static expirationInMin: number = 30;
   static expirationInMs: number = this.expirationInMin * 60 * 1000;

   constructor(readonly value: string) {}
}
