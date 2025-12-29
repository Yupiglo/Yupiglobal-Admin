// import { cookies } from 'next/headers';
// import { Privilege } from "@/types/types";
// import { getPrivilegesFromCookie } from "@/utils/getPrivilegeData";

export const validateDecimalInput = (e: React.FormEvent<HTMLInputElement>) => {
  let value = e.currentTarget.value;

  // ✅ Allow only numbers and one decimal point
  value = value.replace(/[^0-9.]/g, "");

  // ✅ Ensure only one decimal point is allowed
  const decimalCount = (value.match(/\./g) || []).length;
  if (decimalCount > 1) {
    value = value.slice(0, value.lastIndexOf(".")); // Remove extra decimals
  }

  // ✅ Restrict to two decimal places
  if (value.includes(".")) {
    const [integerPart, decimalPart] = value.split(".");
    if (decimalPart.length > 2) {
      value = `${integerPart}.${decimalPart.slice(0, 2)}`; // Trim to two decimals
    }
  }

  e.currentTarget.value = value; // ✅ Update input field
};
export const rolePermission = [
  { field: "canRead", label: "Read" },
  { field: "canCreate", label: "Create" },
  { field: "canEdit", label: "Edit" },
  { field: "canDelete", label: "Delete" },
  { field: "canExport", label: "Export" },
]

export const formatData = (date: string) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  let hours = (dateObj.getHours());
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${period}`;
  return `${day}/${month}/${year} ${formattedTime}`;
} 

// interface UserCookieData {
//   token: string | undefined;
//   email: string | undefined;
//   userid: string | undefined;
//   username: string | undefined;
//   privileges: Privilege[];
// }

// export const getUserCookieData = async (): Promise<UserCookieData> => {
//   const cookieStore = cookies();
//   const token = (await cookieStore).get("token")?.value;
//   const email = (await cookieStore).get("email")?.value;
//   const userid = (await cookieStore).get("userid")?.value;
//   const username = (await cookieStore).get("username")?.value;
//   const privileges = await getPrivilegesFromCookie();

//   return {
//     token,
//     email,
//     userid,
//     username,
//     privileges,
//   };
// };
