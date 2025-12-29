/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import deleteAppCookie from "./deleteAppCookie";
export const clearLocalStorage = (): void => {
  localStorage.clear();
  deleteAppCookie();
};

/** Function to set a single cookie */
export const handleSetCookie = async (cookieName: string, cookieValue: string): Promise<void> => {
  if (!cookieValue) {
    console.log(`Empty value for cookie: ${cookieName}`);
    return;
  }

  try {
    const response = await fetch('/api/setCookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cookieName, cookieValue }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Cookie ${cookieName} set successfully:`, data.message);
    } else {
      console.error(`Failed to set cookie ${cookieName}:`, response.statusText);
    }
  } catch (error) {
    console.error(`Error setting cookie ${cookieName}:`, error);
  }
};

/** Function to set local storage and cookies on client-side */
export const setLocalStorageAndCookies = async (user: any): Promise<void> => {
  if (!user || typeof user !== "object") {
    console.error("Invalid user object provided for setting cookies.");
    return;
  }

  try {
    console.log(user)
    await handleSetCookie("token", user.token || "");
    const decodedEmail = user.email ? decodeURIComponent(user.email) : "";
    await handleSetCookie("email", decodedEmail);
    await handleSetCookie("username", user.username || "");
    console.log("All cookies set successfully.");
  } catch (error) {
    console.error("Error setting cookies:", error);
  }
};

export const setLocalStorageUserData = (user: any): void => {
  if (!user || typeof user !== "object") {
    console.error("Invalid user object provided for setting localStorage.");
    return;
  }

  try {
    localStorage.setItem("token", user.token || "");
    const decodedEmail = user.email ? decodeURIComponent(user.email) : "";
    localStorage.setItem("email", decodedEmail);
    localStorage.setItem("username", user.username || "");
    console.log("All user data set in localStorage successfully.");
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
};