"use client";
import { useState, useEffect } from "react";
import InputField from "../SharedComponents/InputField";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Box from "../SharedComponents/Box";
import { useAuth } from "@/context/AuthContext";
import { buildApiUrl } from "@/utils/apiBase";

export default function SubCategoryList() {
  const router = useRouter();
  const { user } = useAuth();
  const token = user.token;
  const authHeader = token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : "";

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editSubCategory, setEditSubCategory] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch subcategories
  const fetchSubCategories = () => {
    setLoading(true);
    fetch(buildApiUrl("subcategories"), {
      headers: {
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })
      .then(res => res.json())
      .then(data => setSubcategories(data.getAllSubCategories || []))
      .catch(() => toast.error("Failed to fetch subcategories"))
      .finally(() => setLoading(false));
  };

  // Fetch categories for dropdown
  const fetchCategories = () => {
    fetch(buildApiUrl("categories"), {
      headers: {
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })
      .then(res => res.json())
      .then(data => setCategories(data.getAllCategories || []))
      .catch(() => toast.error("Failed to fetch categories"));
  };

  useEffect(() => {
    if (!authHeader) return;
    fetchSubCategories();
    fetchCategories();
  }, [authHeader]);

  // Handle Edit: show form and populate fields
  const handleEdit = (subcat: any) => {
    const categoryId = subcat?.category ?? subcat?.category_id ?? "";
    setEditSubCategory(subcat);
    setName(subcat.name || "");
    setCategory(categoryId);
  };

  // Handle Delete
  const handleDelete = (subcat: any) => {
    const subcatId = subcat?._id ?? subcat?.id;
    if (!subcatId) {
      toast.error("Invalid subcategory id");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    fetch(buildApiUrl(`subcategories/${subcatId}`), {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Subcategory deleted!");
        fetchSubCategories();
      })
      .catch(() => toast.error("Failed to delete subcategory"));
  };

  // Handle Update (Edit Submit)
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const editId = editSubCategory?._id ?? editSubCategory?.id;
    if (!editId) {
      toast.error("Invalid subcategory id");
      setIsSubmitting(false);
      return;
    }

    const payload: any = { name, category_id: category };

    fetch(buildApiUrl(`subcategories/${editId}`), {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(errorText || "Request failed");
          });
        }
        return response.json();
      })
      .then(() => {
        toast.success("Subcategory updated successfully!");
        setEditSubCategory(null);
        setName("");
        setCategory("");
        fetchSubCategories();
      })
      .catch((err) => {
        toast.error(err.message || "An error occurred");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditSubCategory(null);
    setName("");
    setCategory("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header Card */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Subcategories
          </h2>
          <p className="text-gray-500 text-sm mt-1">Organize your products with subcategories</p>
        </div>
        <div className="text-sm text-gray-400 font-medium">Total: {subcategories.length}</div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent Category</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subcategories.map((subcat) => {
                  const subcatId = subcat?._id ?? subcat?.id;
                  const categoryId = subcat?.category ?? subcat?.category_id;
                  const parentCat = categories.find((cat: any) => cat._id === categoryId);
                  return (
                    <tr
                      key={(subcatId ?? `${subcat?.name ?? "subcat"}-${categoryId ?? ""}`) as any}
                      className="group hover:bg-blue-50/30 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">{subcat.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100">{subcat.slug}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {parentCat?.name || categoryId}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(subcat)}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          </button>
                          <button
                            onClick={() => handleDelete(subcat)}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal Overlay */}
      {editSubCategory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={handleCancelEdit} />

          {/* Sliding Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Subcategory</h2>
                <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <InputField
                  label="Subcategory Name"
                  id="name"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none appearance-none bg-white text-gray-700"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    className="flex-1 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Subcategory"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}