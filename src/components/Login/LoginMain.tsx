"use client";
import { useRouter } from "next/navigation";
import { LoginForm } from "../../components/index";
import { useEffect, useState } from "react";
import { validateSession } from "@/libs/sharedService";
import { useLoader } from "@/hooks/Loader";
import { clearLocalStorage } from "@/utils/clearStorage";
import CommonLayout from "../SharedComponents/CommonLayout";

interface LoginMainProp {
  readonly token?: string;
  readonly email?: string;
}

export default function LoginMain(props: LoginMainProp) {
  const router = useRouter();
  const { token, email } = props;
  const [isLogin, setIsLogin] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    /** Function to check for valid user session and auto-login*/
    const validateUserSession = async () => {
      const res = await validateSession(
        email ?? "",
        token ?? "",
        showLoader,
        hideLoader
        //cryptoConfig
      );
      if (res.status !== 200) {
        clearLocalStorage();
      } else {
        setIsLogin(true);
      }
    };

    if (email && token) {
      validateUserSession();
    }
    if (isLogin) {
      router.push("/dashboard");
    }
  }, [isLogin, token]);

  return (
    <div>
      {!isLogin && (
        <CommonLayout>
          <LoginForm />
        </CommonLayout>
      )}
    </div>
  );
}
