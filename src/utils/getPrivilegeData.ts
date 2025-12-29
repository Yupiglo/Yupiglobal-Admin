// "use client"
import pako from 'pako';
import { cookies } from 'next/headers';

export const getPrivilegesFromCookie = async () => {
  const cookieStore = cookies();
  const encoded = (await cookieStore).get('privilege')?.value;

  if (!encoded) return null;

  try {
    // Decode base64
    const compressedBuffer = Buffer.from(encoded, 'base64');

    // Gzip decompress
    const decompressed = pako.ungzip(compressedBuffer, { to: 'string' });

    // Parse JSON
    const privileges = JSON.parse(decompressed);
    return privileges;
  } catch (err) {
    console.error("Failed to decode privilege cookie:", err);
    return null;
  }
}
