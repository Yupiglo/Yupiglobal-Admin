interface CryptoConfig {
    secretKey: string;
    secretIv: string;
    encryptionMethod: string;
  }
  const configObj: CryptoConfig = {
    secretKey: process.env.NEXT_PUBLIC_AES_SECRET_KEY ?? '',
    secretIv: process.env.NEXT_PUBLIC_AES_SECRET_IV ?? '',
    encryptionMethod: process.env.NEXT_PUBLIC_AES_SECRET_METHOD ?? ''
  };
  export default configObj;