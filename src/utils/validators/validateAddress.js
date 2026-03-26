   
export const validateAddress = (value) => {
  let error = "";
    if (!value.trim()) error = "Please enter details";
        else if (!/^[A-Za-z0-9\s]+$/.test(value))
          error = "Please enter valid details";
    return error;
};

