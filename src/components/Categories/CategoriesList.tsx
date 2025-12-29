"use client";
import React, { useState, useEffect } from "react";
import InputField from "../SharedComponents/InputField";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Box from "../SharedComponents/Box"; // Added this import based on the instruction's implied change
import { useAuth } from "@/context/AuthContext";
import { buildApiUrl, buildAssetUrl } from "@/utils/apiBase";

export default function CategoriesList() {
  const router = useRouter();
  const { user } = useAuth();
  const token = user.token;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editCategory, setEditCategory] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  const fetchCategories = () => {
    setLoading(true);
    fetch(buildApiUrl("categories"), {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => setCategories(data.getAllCategories || []))
      .catch(() => toast.error("Failed to fetch categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Edit: show form and populate fields
  const handleEdit = (category: any) => {
    setEditCategory(category);
    setName(category.name || "");
    setImage(category.Image || null);
  };

  // Handle Delete
  const handleDelete = (category: any) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    fetch(buildApiUrl(`categories / ${category._id} `), {
      method: "DELETE",
      headers: { Authorization: token }
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Category deleted!");
        fetchCategories();
      })
      .catch(() => toast.error("Failed to delete category"));
  };

  // Handle image change (to base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Update (Edit Submit)
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: any = { name };
    if (image) payload.Image = image;

    fetch(buildApiUrl(`categories / ${editCategory._id} `), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
        toast.success("Category updated successfully!");
        setEditCategory(null);
        setName("");
        setImage(null);
        fetchCategories();
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
    setEditCategory(null);
    setName("");
    setImage(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header Card */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Categories
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your product categories</p>
        </div>
        <Button
          text="Add New Category"
          btnType="button"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all border-none"
          onClick={() => router.push("/categories")}
        />
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
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat._id} className="group hover:bg-blue-50/30 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="h-12 w-12 rounded-lg overflow-hidden ring-1 ring-gray-100 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                        {cat.Image ? (
                          <img
                            src={buildAssetUrl(cat.Image)}
                            alt={cat.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-1">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        {cat.slug || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No categories found</p>
                <p className="text-gray-400 text-sm mt-1">Start by creating a new category</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">Edit Category</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="space-y-4">
                <InputField
                  label="Category Name"
                  id="name"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2"
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                        {image && typeof image === "string" ? (
                          <img src={buildAssetUrl(image)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-medium">Change</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">Upload a new image (optional).</p>
                      <p className="text-xs text-gray-400">Supported formats: JPG, PNG, GIF</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <Button
                  text="Cancel"
                  btnType="button"
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-none"
                  onClick={handleCancelEdit}
                />
                <Button
                  text={isSubmitting ? "Updating..." : "Save Changes"}
                  btnType="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 border-none"
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}