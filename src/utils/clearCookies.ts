import { deleteCookie } from "cookies-next";

/** Function to clear cookies from middleware
 *  Invoked only on server-side
 */
export const clearCookies = (): void => {
  deleteCookie("email");
  deleteCookie("token");
  deleteCookie("username");
};
