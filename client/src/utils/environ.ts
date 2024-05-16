export const PREFIXES = {
  admin: '_admin',
};

type Environ = 'admin' | '';

export const environ = (): Environ => {
  const url = window.location.href;
  if (url.includes(PREFIXES.admin)) {
    return 'admin';
  }
  return '';
};
