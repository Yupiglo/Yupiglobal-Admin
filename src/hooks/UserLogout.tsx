"use client";
import { Logout } from "@/libs/loginService"
import { clearLocalStorage } from "../utils/clearStorage";

/**  Function to handle user logout 
*/
const UserLogout = async (email: string,
  token: string,
  router: any
) => {

  try {
    const response = await Logout(email, token);

    if (response.status === 200) {
      clearLocalStorage();
      router.push("/login");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export default UserLogout;