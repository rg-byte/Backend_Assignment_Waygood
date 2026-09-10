import validator from "validator";
import { generateAccessToken,generateRefreshToken } from "./jwt.utils.js";

const validate = (fullName, email, password, role) => {
  const errors = [];
  let hasError = false;
  let validRoles = ["user", "admin", "seller"];

  if (!fullName || !validator.isLength(fullName, { min: 3, max: 16 })) {
    hasError = true;
    errors.push({ message: "Invalid Fullname" });
  }

  if (!email || !validator.isEmail(email)) {
    hasError = true;
    errors.push({ message: "Invalid Email" });
  }

  if (
    !password ||
    !validator.isStrongPassword(password, {
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
  ) {
    hasError = true;
    errors.push({ message: "Invalid Password" });
  }

  if (role && !validRoles.includes(role)) {
    hasError = true;
    errors.push({ message: "Invalid Role" });
  }

  return { errors, hasError };
};

export default validate;