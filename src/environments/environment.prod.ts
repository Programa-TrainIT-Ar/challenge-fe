export const environment = {
  production: true,
  auth: {
    domain: "dev-hwbroc2d1yqqr04v.us.auth0.com",
    clientId: "TTVpH09MQpHbU6oHQjXAVt4I66h9f2Hk",
    authorizationParams: {
      audience: 'https://challenge-be-production.onrender.com',
      redirect_uri: 'https://challenge-fe-production.netlify.app//callback',
    },
  },
  url: 'https://challenge-be-production.onrender.com'
};
