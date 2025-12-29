"use client";
import { useState, useEffect } from "react";
import InputField from "../SharedComponents/InputField";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buildApiUrl } from "@/utils/apiBase";

export default function CategoryList({ editCategory, onSuccess }: any) {
  const router = useRouter();
  const [name, setName] = useState(editCategory?.name || "");
  const [image, setImage] = useState<File | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const token = user.token;
  const authHeader = token?.toLowerCase?.().startsWith("bearer ") ? token : `Bearer ${token}`;

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name || "");
    }
  }, [editCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result is base64 string
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = { name };
      if (image) payload.Image = image;

      const url = editCategory
        ? buildApiUrl(`categories/${editCategory._id}`)
        : buildApiUrl("categories");
      const method = editCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Request failed");
      }

      toast.success(`Category ${editCategory ? "updated" : "created"} successfully!`);
      if (onSuccess) onSuccess();
      router.push("/categories");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
        <h2 className="text-2xl font-bold">
          {editCategory ? "Update Category" : "Add New Category"}
        </h2>
        <p className="opacity-90 mt-1 text-sm">Fill in the details below</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">

          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
            <InputField
              id="name"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50 focus:bg-white"
              placeholder="e.g. Electronics"
              required
            />
          </div>

          {/* Image Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category Cover</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group relative ${image ? 'bg-blue-50/50 border-blue-200' : ''}`}>
              <div className="space-y-1 text-center relative z-10">
                {image && typeof image === "string" ? (
                  <div className="relative inline-block">
                    <img src={image} alt="Preview" className="h-32 w-auto object-contain mx-auto rounded-lg shadow-sm" />
                    <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                      Change Image
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              text={isSubmitting ? (editCategory ? "Updating..." : "Creating...") : (editCategory ? "Update Category" : "Create Category")}
              btnType="submit"
              className={`w-full py-4 text-white font-semibold text-lg rounded-xl shadow-lg transition-all transform active:scale-[0.98] border-none
                  ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'}
                `}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}