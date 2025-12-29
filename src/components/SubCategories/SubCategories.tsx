"use client";
import { useState, useEffect } from "react";
import InputField from "../SharedComponents/InputField";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Box from "../SharedComponents/Box";
import { useAuth } from "@/context/AuthContext";
import { buildApiUrl } from "@/utils/apiBase";

export default function SubCategory({ editCategory, onSuccess }: any) {
  const router = useRouter();
  const [name, setName] = useState(editCategory?.name || "");
  const [category, setCategory] = useState(editCategory?.category || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { user } = useAuth();
  const token = user.token;
  const authHeader = token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : "";

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name || "");
      setCategory(editCategory.category || "");
    }
  }, [editCategory]);

  // Fetch categories for dropdown
  useEffect(() => {
    fetch(buildApiUrl("categories"), {
      headers: {
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })
      .then(res => res.json())
      .then(data => setCategories(data.getAllCategories || []))
      .catch(() => toast.error("Failed to fetch categories"));
  }, [authHeader]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = { name, category_id: category };

      const url = editCategory
        ? buildApiUrl(`subcategories/${editCategory._id}`)
        : buildApiUrl("subcategories");
      const method = editCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Request failed");
      }

      toast.success(`Subcategory ${editCategory ? "updated" : "created"} successfully!`);
      if (onSuccess) onSuccess();
      router.push("/subcategories");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {editCategory ? "Edit Subcategory" : "Add Subcategory"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {editCategory ? "Modify existing subcategory details" : "Create a new subcategory for better organization"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                <option value="" disabled>Select Category</option>
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

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <Button
              text={isSubmitting ? (editCategory ? "Updating..." : "Creating...") : (editCategory ? "Update Subcategory" : "Create Subcategory")}
              btnType="submit"
              className={`px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}