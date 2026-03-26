
export const validateFullName = (value) => {
  let error = "";
  if (!value.trim()) error = "Please enter full name";
  else if (!/^[A-Za-z\s]+$/.test(value))
    error = "Please enter valid full name";
  else if (value.length > 30)
    error = "Full name cannot exceed 30 characters."
  return error;
};

