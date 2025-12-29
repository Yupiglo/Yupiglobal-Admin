import CryptoJS from 'crypto-js';


const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY ?? '';


export const setSecureItem = (key: string, value: string) => {

    const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();

    localStorage.setItem(key, encrypted);

};


export const getSecureItem = (key: string): string | null => {

    const encrypted = localStorage.getItem(key);

    if (!encrypted) return null;


    try {

        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);

        return bytes.toString(CryptoJS.enc.Utf8);

    } catch {

        return null;

    }

};


export const removeSecureItem = (key: string) => {

    localStorage.removeItem(key);

};