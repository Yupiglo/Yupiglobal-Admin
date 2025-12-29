
import LoginMain from "@/components/Login/LoginMain";
import { cookies } from 'next/headers';

/**  Container function to render the Login page
 * and separate the view logic from the route handler.
 */
export default async function Login() {

  // const cookieStore = await cookies();
  // const token = cookieStore.get('token')?.value ?? "";
  // const email = cookieStore.get('email')?.value ?? "";

  return <LoginMain />;
}
