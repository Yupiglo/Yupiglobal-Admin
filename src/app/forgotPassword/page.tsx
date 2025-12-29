import ForgotPasswordMain from "@/components/Forgot/ForgotPasswordMain";
import CommonLayout from "@/components/SharedComponents/CommonLayout";
/**  Container function to render the Forgot OTP page
 * and separate the view logic from the route handler.
 */

export default async function Login() {
  return (
    <CommonLayout>
      <ForgotPasswordMain />
    </CommonLayout>
  );
}
