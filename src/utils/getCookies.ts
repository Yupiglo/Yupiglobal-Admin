/* eslint-disable @typescript-eslint/no-explicit-any */
/**Function to retrieve stored cookies from client-side */
const getCookies = () => {
    const cookies: any = {};
    const cookieArray = document.cookie.split('; ');

    cookieArray.forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookies[key] = decodeURIComponent(value);
    });

    return cookies;
};

export default getCookies;