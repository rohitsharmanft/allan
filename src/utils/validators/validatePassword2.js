export const validatePassword2 = (password, password2) => {
  let error = "";
    if (!password2.trim()) error = "Please enter confirm password.";
        else if (password2 !== password)
          error = "New password and confirm password does not match.";
    return error;
};