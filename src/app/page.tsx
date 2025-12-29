import CommonLayout from "@/components/SharedComponents/CommonLayout";
import LoginForm from "../components/Login/Login";
export default function Home() {
  return (
    <CommonLayout>
      <LoginForm />
    </CommonLayout>
  );
}
// import React from "react";
// import { AuthProvider } from "@/context/AuthContext";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }