export interface LoginObject {
    pan: string;
    password: string;
    otp: string;
    type : string,
    ip : string
    // Add other relevant properties as needed
  }

  export interface SendOtpLoginObject {
    type: string,
    value:string
  }

  export interface CreatePwdObject {
    email: string | null,
    newPassword:string
  }

  export interface LogoutObject {
    userId: string | null
    
  }
  
  
  