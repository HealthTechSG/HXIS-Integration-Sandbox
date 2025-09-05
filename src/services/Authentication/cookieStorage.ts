import { CookieStorage } from 'aws-amplify/utils';

export const cookieStorage = new CookieStorage({
  domain: '.healthx.sg',
  secure: false,
  path: '/',
  expires: 365, // Number of days before the cookie expires
});
