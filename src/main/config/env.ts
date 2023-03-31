import "dotenv/config";

export const env = {
   facebookApi: {
      clientId: process.env.FB_CLIENT_ID ?? '',
      clientSecret: process.env.FB_CLIENT_SECRET ?? ''
   },
   port: process.env.PORT ?? 8080,
   jwtSecret: process.env.JWT_SECRET ?? '',
   s3: {
      accessKey: process.env.AWS_S3_ACCESS_KEY ?? '',
      secret: process.env.AWS_S3_SECRET ?? '',
      bucket: process.env.AWS_S3_BUCKET ?? ''
   }
};
