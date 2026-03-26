
export const validatePassword = (password) => {
  if (!password.trim()) return "Please enter password.";
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password))
    return "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
  return ""; // valid
};
