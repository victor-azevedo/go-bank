export const validCpf1 = "02775520014";
export const validCpf2 = "64137987009";
export const invalidCpf = "asd";

export const invalidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export const mockSignUp1 = {
  name: "Victor Azevedo",
  cpf: validCpf1,
  password: "PassWord123",
};

export const mockSignUp2 = {
  name: "Victor Azevedo",
  cpf: validCpf2,
  password: "PassWord123",
};

export const mockSignIn1 = {
  cpf: validCpf1,
  password: "PassWord123",
};

export const mockSignIn2 = {
  cpf: validCpf2,
  password: "PassWord123",
};

export const mockOperation1 = {
  value: 50.1,
};

export const mockOperation2 = {
  value: 10.05,
};

export const mockTransfer1 = {
  accountNumberDestiny: 1,
  value: 5,
};

export const mockTransfer2 = {
  accountNumberDestiny: 1,
  value: 10.87,
};
