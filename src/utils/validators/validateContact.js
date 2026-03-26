
export const validateContact = (number) => {
  let error = "";
  const numberRegex = /^[+\-\d]+$/;
    if (!number.trim()) error = "Please enter phone number.";
    else if (!numberRegex.test(number))
      error = "Please enter valid phone number.";
    else {
      const digitsOnly = number.replace(/[^\d]/g, "");
      if (digitsOnly.length < 8 || digitsOnly.length > 15)
        error = "Phone number should be between 8 to 15 digits.";
    }
    return error;
};

