type StorageMode = 'local' | 'session' | 'cookie';
type ActionMode = 'set' | 'get' | 'remove';

/**
 * Generic function to handle localStorage, sessionStorage, and cookies
 * @param key - Storage key
 * @param value - (Optional) Value to set (only for 'set' action)
 * @param mode - Storage mode ('local', 'session', or 'cookie')
 * @param action - Action to perform ('set', 'get', 'remove')
 * @param expiresInDays - (Optional) Expiry time for cookies (only for cookies)
 * @returns Value if action is 'get', otherwise void
 */
export function handleStorage(
    key: string,    
    mode: StorageMode,
    action: ActionMode,
    expiresInDays?: number,
    value: string = '',
): string | void {
    const storage = mode === 'local' ? localStorage : sessionStorage;

    if (mode !== 'cookie') {
        if (action === 'set') storage.setItem(key, value);
        if (action === 'get') return storage.getItem(key) ?? '';
        if (action === 'remove') storage.removeItem(key);
        return;
    }

    // Handle cookies
    if (action === 'set') {
        const expires = expiresInDays
            ? `; expires=${new Date(Date.now() + expiresInDays * 864e5).toUTCString()}`
            : '';
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${expires}; path=/`;
    } else if (action === 'get') {
        return getCookies()[key] ?? ''; // Use the optimized getCookies function
    } else if (action === 'remove') {
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
}

/**
 * Function to retrieve stored cookies from the client-side
 * @returns {Record<string, string>} Object containing all cookies
 */
const getCookies = (): Record<string, string> => {
    return document.cookie
        .split('; ')
        .map(cookie => cookie.split('='))
        .reduce((cookies: Record<string, string>, [key, value]) => {
            if (key) cookies[key] = decodeURIComponent(value ?? '');
            return cookies;
        }, {});
};