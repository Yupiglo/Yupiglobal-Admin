/**  Function to mask email and phone number
 */
export function MaskUserInfo(type: string, value: string, fromChar: number): string {

    let maskedValue="";
    const maskString = (str: string, start: number, length: number): string => {
      const mask = '*'.repeat(length);
      return str.substring(0, start) + mask + str.substring(start + length);
    };
  
    // const maskEmail = (email: string): string => {
    //   const [localPart, domain] = email.split('@');
    //   const maskedLocalPart = maskString(localPart, 4, 5);
    //   return `${maskedLocalPart}@${domain}`;
    // };
    if(type.toUpperCase() === "EMAIL"){
      const [localPart, domain] = value.split('@');
      const maskedLocalPart = maskString(localPart, fromChar, localPart.length/2);
      maskedValue =`${maskedLocalPart}@${domain}`;
    }
    else{
      maskedValue=maskString(value, fromChar, value.length/2);
    }

    return maskedValue
  }
  