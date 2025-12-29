/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { decrypt } from "@/utils/aes";
//const apiUrl = process.env.NEXT_PUBLIC_API_URL';

import { buildApiUrl } from "@/utils/apiBase";

interface Payload {
  [key: string]: any;
}

// List of allowed status codes
const allowedStatusCodes = [400, 401, 402, 403, 404, 429];

/**  Common function for REST API calls and parsing response*/

const baseHandler = async (
  method: string,
  payload: Payload,
  token: string,
  showLoader?: () => void,
  hideLoader?: () => void,
  cryptoConfig?: any
  //cryptoConfig?: any
): Promise<any> => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  const apiName = isFormData ? (payload.get("apiname") as string | null) : (payload as any).apiname;
  const url = buildApiUrl(apiName ?? "");
  console.log(url)
  if (isFormData) {
    payload.delete("apiname");
  } else {
    delete (payload as any).apiname;
  }
  // Check for the token in the local storage
  //const cookies = getCookies();
  //const { token }  = cookies;
  //const token = localStorage.getItem("Token");
  console.log(payload)
  const headers: HeadersInit = {};
  headers["Accept"] = "application/json";
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers: headers,
    body: method !== "GET" ? (isFormData ? (payload as any) : JSON.stringify(payload)) : undefined,
    cache: "no-cache",
  };
  console.log(options)
  showLoader && showLoader();
  try {
    console.log(url)
    const response = await fetch(url, options);
    console.log(response)
    if (!response.ok && !allowedStatusCodes.includes(response.status)) {
      if ([401, 403, 500].includes(response.status)) {
        const apiResponse = await response.json();
        // const randomKey = decrypt(apiResponse.msg, cryptoConfig);
        //return JSON.parse(apiResponse.response);
        // const randomKey = decrypt(apiResponse.msg, cryptoConfig);
        // return JSON.parse(decrypt(apiResponse.response, cryptoConfig, randomKey));
        return apiResponse;
      }
      console.error(`Error ${response.status}: ${response.statusText}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    if (allowedStatusCodes.includes(response.status) || response.ok) {
      // You can return the response or handle it as needed
      const apiResponse = await response.json();
      // const randomKey = decrypt(apiResponse.msg, cryptoConfig);
      // return JSON.parse(decrypt(apiResponse.response, cryptoConfig, randomKey));
      return typeof apiResponse == "object"
        ? apiResponse
        : JSON.parse(apiResponse);
    }
  } catch (error) {
    console.log(`Request to ${url} failed:`, error);
    throw error;
  } finally {
    hideLoader && hideLoader();
  }
};

export default baseHandler;
