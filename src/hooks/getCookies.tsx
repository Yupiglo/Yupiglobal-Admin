import { cookies } from 'next/headers';
// import { getPrivilegesFromCookie } from "@/utils/getPrivilegeData";

interface UserCookieData {
  token: string | undefined;
  email: string | undefined;
  // userid: string | undefined;
  username: string | undefined;
  // privileges: Privilege[];
  // mobile:string | undefined;
  // usertype:string | undefined;
  // code:string | undefined;
  // products:string | undefined
}

export const getUserCookieData = async (): Promise<UserCookieData> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const email = (await cookieStore).get("email")?.value;
  // const userid = (await cookieStore).get("userid")?.value;
  const username = (await cookieStore).get("username")?.value;
  // const mobile = (await cookieStore).get("mobile")?.value;
  // const usertype = (await cookieStore).get("usertype")?.value;
  // const code  = (await cookieStore).get("code")?.value;
  // const products = (await cookieStore).get("products")?.value;
  // const privileges = await getPrivilegesFromCookie();


  return {
    token,
    email,
    // userid,
    username,
    // privileges,
    // mobile,
    // usertype,
    // code,
    // products
  };
};