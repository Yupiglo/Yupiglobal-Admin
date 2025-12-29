import ResetPassword from "@/components/Forgot/ResetPassword";
import CommonLayout from "@/components/SharedComponents/CommonLayout";

export default async function ForgotPasswordContainer() {
  return (
    <CommonLayout>
      <ResetPassword />
    </CommonLayout>
  );
}
