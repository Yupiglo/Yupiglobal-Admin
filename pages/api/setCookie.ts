import { setCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure it’s a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get the cookie name and value from the request body
  const { cookieName, cookieValue } = req.body;

  if (!cookieName || !cookieValue) {
    return res.status(400).json({ message: 'Bad Request: Missing cookieName or cookieValue' });
  }

  // Set the cookie with the required attributes
  setCookie(cookieName, cookieValue, {
    req,
    res,
    maxAge: 60 * 60 * 24, // 1 day (adjust as needed)
    httpOnly: true, // Only accessible by the server
    secure: process.env.NODE_ENV === 'production', // True if in production
    sameSite: 'strict', // Prevent CSRF attacks
    path: '/', // Available throughout the app
  });

  // Send a success response
  return res.status(200).json({ message: 'Cookie set successfully!' });
}