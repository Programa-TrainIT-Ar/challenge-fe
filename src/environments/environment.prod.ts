export const environment = {
  production: true,
  auth: {
    domain: '${process.env.DOMAIN}',
    clientId: '${process.env.CLIENT_ID}',
    authorizationParams: {
      audience: '${process.env.AUDIENCE}',
      redirect_uri: '${process.env.REDIRECT_URL}',
    },
  },
  url: '${process.env.URL}'
};
