"use client";
import React, { useState, useEffect } from "react";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Edit2, Trash2, Plus, Search, X, ChevronLeft, ChevronRight, Tag, Calendar, Percent } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";

export default function Coupon() {
  const { user } = useAuth();
  const token = user.token;

  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [expires, setExpires] = useState("");
  const [discount, setDiscount] = useState("");

  // Fetch coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("coupons"), {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setCoupons(data.getAllCoupons || []);
    } catch (err) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line
  }, []);

  // Handle Delete
  const handleDelete = async (coupon: any) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(buildApiUrl(`coupons/${coupon._id}`), {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Coupon deleted!");
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  // Open Drawer for Add
  const openAddDrawer = () => {
    setEditId(null);
    setCode("");
    setExpires("");
    setDiscount("");
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const openEditDrawer = (coupon: any) => {
    setEditId(coupon._id);
    setCode(coupon.code);
    setExpires(coupon.expires ? new Date(coupon.expires).toISOString().split('T')[0] : "");
    setDiscount(coupon.discount);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditId(null);
  };

  // Handle Submit (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      code,
      expires,
      discount: Number(discount),
    };

    try {
      const url = editId
        ? buildApiUrl(`coupons/${editId}`) // Assuming there's an update endpoint.
        : buildApiUrl("coupons");

      const method = editId ? "PUT" : "POST";

      // If API doesn't support PUT for coupons (common in simple implementations), we might need to handle differently. 
      // For now assuming standard REST.

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // If 404 on PUT, maybe API doesn't support it.
        if (editId && response.status === 404) {
          throw new Error("Update not supported by API or Coupon not found");
        }
        const errorText = await response.text();
        throw new Error(errorText || "Request failed");
      }

      toast.success(editId ? "Coupon updated successfully!" : "Coupon created successfully!");
      closeDrawer();
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and Pagination
  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
          <p className="text-gray-500 mt-1">Create and manage discount codes</p>
        </div>
        <button
          onClick={openAddDrawer}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search coupon codes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Coupons List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading coupons...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No coupons found.</div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50/50 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Code</div>
              <div className="col-span-3">Discount</div>
              <div className="col-span-3">Expiry Date</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {currentItems.map((coupon) => {
                const expired = isExpired(coupon.expires);
                return (
                  <div key={coupon._id} className={`group p-4 hover:bg-gray-50/50 transition-colors duration-200 ${expired ? 'opacity-60 bg-gray-50' : ''}`}>
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                      {/* Code */}
                      <div className="col-span-3 w-full flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${expired ? 'bg-gray-200 text-gray-500' : 'bg-green-50 text-green-600'}`}>
                          <Tag size={18} />
                        </div>
                        <div>
                          <span className="font-mono font-bold text-gray-800">{coupon.code}</span>
                          {expired && <span className="ml-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Expired</span>}
                        </div>
                      </div>

                      {/* Discount */}
                      <div className="col-span-3 w-full flex md:block items-center justify-between">
                        <span className="md:hidden text-sm font-medium text-gray-500">Discount:</span>
                        <div className="flex items-center gap-1.5">
                          <Percent size={14} className="text-gray-400" />
                          <span className="font-semibold text-gray-900">{coupon.discount}% Off</span>
                        </div>
                      </div>

                      {/* Expiry */}
                      <div className="col-span-3 w-full flex md:block items-center justify-between">
                        <span className="md:hidden text-sm font-medium text-gray-500">Expires:</span>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar size={14} />
                          <span>{coupon.expires ? new Date(coupon.expires).toLocaleDateString() : "No Expiry"}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 w-full flex justify-end gap-2 mt-2 md:mt-0">
                        {/* Note: Edit might fail if API doesn't support it, but UI is provided */}
                        <button
                          onClick={() => openEditDrawer(coupon)}
                          disabled={expired}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Edit Coupon"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCoupons.length)} of {filteredCoupons.length} entries
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "hover:bg-white text-gray-600"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sliding Modal Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">

              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">
                  {editId ? "Edit Coupon" : "Create New Coupon"}
                </h2>
                <button onClick={closeDrawer} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex-1">
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all uppercase placeholder:normal-case font-mono"
                        placeholder="e.g. SUMMER2024"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        placeholder="e.g. 20"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={expires}
                        onChange={(e) => setExpires(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-600"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-100 transition-all flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        editId ? "Update Coupon" : "Create Coupon"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="w-full mt-3 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}