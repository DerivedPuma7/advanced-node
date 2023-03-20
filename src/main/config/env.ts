export const env = {
   facebookApi: {
      clientId: process.env.FB_CLIENT_ID ?? '692835359190626',
      clientSecret: process.env.FB_CLIENT_SECRET ?? '6cbfa3a103abea3dfc5eb8ac95e66e91'
   },
   port: process.env.PORT ?? 8080,
   jwtSecret: process.env.JWT_SECRET ?? 'qualquerchavesupersecreta'
};
