/**Function to clear server-side cookies on log out */
export default function handler(req, res) {
    const cookieNames = ['token', 'email', "username", "usertype", "userid", "privilege", "code", "products", "groupid"];

    const cookies = cookieNames.map(name => 
      `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
    );
  
    res.setHeader('Set-Cookie', cookies);

    res.status(200).json({ message: 'Cookie cleared' });
}