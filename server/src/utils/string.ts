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
