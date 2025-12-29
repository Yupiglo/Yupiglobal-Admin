// const PasswordPolicyRegex =
//   /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*_+-={}\[\]|\\:;"'.]).{8,16}$/;
const PasswordPolicyRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*_+\-={}\[\]|\\:;"'.])(?=.{8,16}$)(?!.*\s).*$/;
const PanCheckRegex = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/;
const MobileRegex = /^\d{10}$/;
const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Global Function to validate form input against the Regex */
export const FieldValidationCheck = async (
  inputValue: string,
  propType: string
): Promise<boolean> => {
  if (inputValue.match(PasswordPolicyRegex) && propType === "password") {
    return true;
  } else if (inputValue.match(PanCheckRegex) && propType === "pan") {
    return true;
  } else if (inputValue.match(MobileRegex) && propType === "mobile") {
    return true;
  } else if (inputValue.match(EmailRegex) && propType === "email") {
    return true;
  } else {
    return false;
  }
};