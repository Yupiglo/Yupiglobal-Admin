
"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../SharedComponents/Button";
import { useAuth } from "@/context/AuthContext";
import { buildApiUrl } from "@/utils/apiBase";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const token = user.token;
  // const email = user.email;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("users"), {
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      setUsers(data.getAllUsers ?? []);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);
  const handleEdit = (category: any) => {
    // router.push(`/categories/edit/${category._id}`);
  };

 
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Active</th>
              <th className="py-2 px-4 border-b">Verified</th>
              <th className="py-2 px-4 border-b">Blocked</th>
              <th className="py-2 px-4 border-b">Wishlist Count</th>
              {/* <th className="py-2 px-4 border-b">Addresses</th> */}
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">{user.isActive ? "Yes" : "No"}</td>
                <td className="py-2 px-4 border-b">{user.verified ? "Yes" : "No"}</td>
                <td className="py-2 px-4 border-b">{user.blocked ? "Yes" : "No"}</td>
                <td className="py-2 px-4 border-b">{user.wishlist ? user.wishlist.length : 0}</td>
                {/* <td className="py-2 px-4 border-b">
                  {user.addresses && user.addresses.length > 0 ? (
                    <ul className="list-disc ml-4">
                      {user.addresses.map((addr: any, idx: number) => (
                        <li key={idx}>
                          {addr.city}, {addr.street}, {addr.phone}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td> */}
                <td className="py-2 px-4 border-b flex gap-2">
                  {/* <Button text="View" className="w-fit px-3 bg-green-500 text-white rounded-md border border-customBlue" btnType="button" onClick={() => handleView(user._id)} /> */}
                  <Button text="Edit" className="w-fit px-3 bg-yellow-500 text-white rounded-md border border-customBlue" btnType="button" onClick={() => handleEdit(user._id)} />
                  {/* <Button text="Delete" className="w-fit px-3 bg-red-600 text-white rounded-md border border-customBlue" btnType="button" onClick={() => handleDelete(user._id)} /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
