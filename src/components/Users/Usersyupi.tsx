"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Download, Trash2, Edit2, User } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";
import { toast } from "react-toastify";
import Button from "../SharedComponents/Button";
import { useAuth } from "@/context/AuthContext";

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const { user } = useAuth();
  const token = user.token;

  const fetchUsers = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${buildApiUrl("users/getalluser")}?page=${pageNum}`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setUsers(data.data ?? []);
      setPage(data.page ?? 1);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line
  }, [page]);

  const handleExpand = (idx: number) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  const handleAction = (user: any) => {
    toast.info(`Action for ${ user.Username }`);
  };

  return (
    <div className="container mx-auto px-6 py-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage system users and access controls</p>
        </div>
        <Button
          text="Export Users"
          btnType="button"
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg shadow-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  {[
                    "Serial No", "Username", "Sponsor", "Placement",
                    "Name", "Phone", "Email", "Gender",
                    "DOB", "Wallet", "Package", "Action"
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((u: any, idx: number) => (
                  <React.Fragment key={u.SerialNo}>
                    <tr
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                      onClick={() => handleExpand(idx)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{u.SerialNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.Username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.SpUsername}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.PlUsername}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.PhoneNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.Email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{u.Gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.DOB ? new Date(u.DOB).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{u.TW}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {u.Package}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="p-1.5 hover:bg-white bg-gray-50 rounded-lg text-blue-600 border border-transparent hover:border-gray-200 transition-all shadow-sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleAction(u);
                          }}
                        >
                          <span className="text-xs font-bold px-2">Manage</span>
                        </button>
                      </td>
                    </tr>
                    {expandedRow === idx && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={12} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs p-2">
                            {/* Expanded details logic could go here if needed, keeping generic for now */}
                            <div className="col-span-full">
                              <h4 className="font-semibold text-gray-900 mb-2">Additional Details</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2">
                                {Object.entries(u).filter(([key]) => !["_id", "SerialNo", "Username", "SpUsername", "PlUsername", "Name", "PhoneNo", "Email", "Gender", "DOB", "TW", "Package"].includes(key)).map(([key, value]) => (
                                  <div key={key} className="flex flex-col">
                                    <span className="text-gray-400 uppercase tracking-wider text-[10px]">{key}</span>
                                    <span className="text-gray-700 font-medium">{String(value ?? "-")}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                className={`px - 3 py - 1.5 text - sm font - medium rounded - lg border transition - all
                     ${
  page <= 1
  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
} `}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                className={`px - 3 py - 1.5 text - sm font - medium rounded - lg border transition - all
                     ${
  page >= totalPages
  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
} `}
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}