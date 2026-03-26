
export const validateEmail = (email) => {
  if (!email.trim()) return "Please enter email address.";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return ""; // valid
};

