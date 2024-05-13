export const low = (str: string) => {
  return str.trim().toLowerCase();
};

export const validatePassword = (pwd: string) => {
  const regex = /^(?!\s*$).{8,30}$/;
  return regex.test(pwd);
};

export const validateCpf = (cpf: string) => {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(cpf);
};

export const toCpf = (str: string) => {
  const trimmed = str.replace(/\s/g, '').replace(/\D/g, '');
  let res = '';
  for (let i = 0; i < trimmed.length; i++) {
    if (i % 3 === 0 && i !== 0 && i < 9) {
      res += '.';
    }
    if (i === 9) {
      res += '-';
    }
    res += trimmed[i];
  }
  return res;
};
