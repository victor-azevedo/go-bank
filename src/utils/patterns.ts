// should contain exactly 11 numeric digits
export const CPF_PATTERN = /^[0-9]{11}$/;

// should contain: at least one numeric digits,
// should contain: at least one alpha lowercase,
// should contain: at least one alpha upcase,
// should contain: at least 8,
export const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
