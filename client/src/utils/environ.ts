export const PREFIXES = {
  admin: '_admin',
};

type Environ = 'admin' | 'unlogged' | 'user';

export const environ = (): Environ => {
  const url = window.location.href;

  if (url.includes('login') || url.includes('register')) {
    return 'unlogged';
  }
  if (url.includes(PREFIXES.admin)) {
    return 'admin';
  }
  return 'user';
};
