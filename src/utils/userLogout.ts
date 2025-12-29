/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logout } from "@/libs/loginService";
import { clearLocalStorage } from "./clearStorage";

/** Utility Function to execute all log out actions
 */
export async function HandleLogOut(
  email: string,
  token: string,
  showLoader: () => void,
  hideLoader: () => void,
  cryptoConfig: any,
  redirectionCallback: (url: string) => void
) {
  try {
    showLoader(); // Start loader

    // Call the Logout API
    await Logout(email, token, showLoader, hideLoader, cryptoConfig);

    // Clear session storage and cookies
    clearLocalStorage();

    // Redirect to the provided URL
    redirectionCallback("/login");
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    hideLoader(); // Stop loader
  }
}
