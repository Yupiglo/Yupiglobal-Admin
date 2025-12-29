
import apiHandler from "../actions/baseHandler";
const validateSession = async (
  email: string,
  token: string,
  showLoader?: () => void,
  hideLoader?: () => void,
  //cryptoConfig?: any
) => {
  const payload = {
    "email": email,
    apiname: 'auth/validateSession'
  };
  return await apiHandler(
    "POST",
    payload,
    token,
    showLoader,
    hideLoader,
    //cryptoConfig
  );
};

export { validateSession };