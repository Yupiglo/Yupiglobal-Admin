"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Upload, X } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";

interface BrandFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function BrandForm({ initialData, onSuccess, onCancel, isModal = false }: BrandFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [image, setImage] = useState<File | string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(initialData?.Image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const token = user.token;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setExistingImage(initialData.Image || null);
      setImage(null);
    }
  }, [initialData]);

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

  const handleRemoveImage = () => {
    setImage(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = { name };

      if (image) {
        payload.Image = image;
      } else if (existingImage) {
        payload.Image = existingImage;
      }

      const isEdit = !!initialData?._id;
      const url = isEdit
        ? buildApiUrl(`brands/${initialData._id}`)
        : buildApiUrl("brands");
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Request failed");
      }

      toast.success(isEdit ? "Brand updated successfully!" : "Brand created successfully!");
      if (onSuccess) onSuccess();
      if (!isModal) router.push("/brands");

      // Reset if not modal
      if (!isModal && !isEdit) {
        setName("");
        setImage(null);
        setExistingImage(null);
      }

    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${isModal ? "" : "max-w-2xl mx-auto"} bg-white rounded-2xl ${isModal ? "" : "shadow-sm border border-gray-100"}`}>
      {!isModal && (
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{initialData ? "Edit Brand" : "Add New Brand"}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage brand details and visualization</p>
        </div>
      )}

      <div className={`${isModal ? "" : "p-8"}`}>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 bg-gray-50/50 focus:bg-white"
              placeholder="e.g. Nike, Adidas"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Logo</label>

            {/* Image Preview Area */}
            {(image || existingImage) ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                <img
                  src={(image as string) || (existingImage as string)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-indigo-400 transition-colors bg-gray-50/50 text-center cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-indigo-600 transition-colors">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <Upload size={20} />
                  </div>
                  <span className="text-sm font-medium">Click to upload logo</span>
                  <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3 border-t border-gray-100">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2.5 px-6 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all ${onCancel ? 'flex-1' : 'w-full'}`}
            >
              {isSubmitting ? "Saving..." : (initialData ? "Update Brand" : "Create Brand")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}