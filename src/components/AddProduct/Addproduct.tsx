"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { Upload, X, Plus, Trash2, Info } from "lucide-react";
import { buildApiUrl, buildAssetUrl } from "@/utils/apiBase";

interface ProductFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function ProductForm({ initialData, onSuccess, onCancel, isModal = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const token = user.token;
  const authHeader = token?.toLowerCase?.().startsWith("bearer ") ? token : `Bearer ${token}`;

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [isNew, setIsNew] = useState(initialData?.new || false);
  const [sale, setSale] = useState(initialData?.sale || false);
  const [discount, setDiscount] = useState(initialData?.discount?.toString() || "");
  const [variants, setVariants] = useState<any[]>(initialData?.variants || []);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [imgCover, setImgCover] = useState<string>(initialData?.imgCover || "");
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories
  useEffect(() => {
    fetch(buildApiUrl("categories"))
      .then(res => res.json())
      .then(data => {
        setCategories(data.getAllCategories || []);
      })
      .catch(() => toast.error("Failed to fetch categories"));
  }, []);

  // Update state when initialData changes (important for modal reuse)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setBrand(initialData.brand || "");
      setCategory(initialData.category || "");
      setPrice(initialData.price?.toString() || "");
      setIsNew(initialData.new || false);
      setSale(initialData.sale || false);
      setDiscount(initialData.discount?.toString() || "");
      setVariants(initialData.variants || []);
      setExistingImages(initialData.images || []);
      setImgCover(initialData.imgCover || "");
    }
  }, [initialData]);

  // Variant handlers
  const handleAddVariant = () => setVariants([...variants, { sku: "", size: "", color: "", image_id: 0 }]);
  const handleRemoveVariant = (idx: number) => setVariants(variants.filter((_, i) => i !== idx));
  const handleVariantChange = (idx: number, field: string, value: string | number | null) => {
    const updated = [...variants];
    updated[idx][field] = value;
    setVariants(updated);
  };

  // Image handlers
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && (existingImages.length + images.length) < 10) {
      // Allow multiple files selection if needed, currently 1 by 1 as per logic, 
      // but input type='file' usually allows multiple if configured. 
      // The original code took index 0, so adhering to that but maybe improving later.
      const file = e.target.files[0];
      setImages([...images, file]);
    } else {
      toast.error("You can only upload up to 10 images total.");
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  // Submit handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (brand) formData.append("brand", brand);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("new", isNew.toString());
    formData.append("sale", sale.toString());
    if (discount) formData.append("discount", discount);

    // Filter out empty variants
    const validVariants = variants.filter(variant =>
      variant.sku || variant.size || variant.color
    );
    if (validVariants.length > 0) formData.append("variants", JSON.stringify(validVariants));

    if (existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    const isEdit = !!initialData?._id;
    const url = isEdit
      ? buildApiUrl(`products/${initialData._id}`)
      : buildApiUrl("products");
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          Authorization: authHeader,
        },
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data: any = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        if (isJson && data?.message === "Validation Error" && Array.isArray(data?.details)) {
          const errorMsg = data.details.map((err: any) => `${err.field}: ${err.message}`).join(", ");
          throw new Error(errorMsg);
        }
        throw new Error((isJson ? data?.message : data) || "Request failed");
      }

      toast.success(data.message || (isEdit ? "Product updated successfully!" : "Product created successfully!"));

      // Reset form if creating new, but not needed if redirecting/closing modal
      if (!isEdit) {
        setTitle(""); setDescription(""); setPrice(""); setImages([]); setVariants([]);
      }

      if (onSuccess) onSuccess();
      // If not in modal (standalone page), redirect
      if (!isModal) router.push("/productlist");

    } catch (err: any) {
      toast.error(err.message ?? "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${isModal ? "" : "max-w-4xl mx-auto"} bg-white rounded-2xl ${isModal ? "" : "shadow-sm border border-gray-100"}`}>
      {!isModal && (
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{initialData ? "Edit Product" : "Add New Product"}</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to {initialData ? "update the" : "create a"} product</p>
        </div>
      )}

      <div className={`${isModal ? "" : "p-8"}`}>
        <form onSubmit={handleAddProduct} className="space-y-8">
          {/* Basic Info Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-indigo-500 pl-3">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 bg-gray-50/50 focus:bg-white"
                  placeholder="e.g. Premium Cotton T-Shirt"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 bg-gray-50/50 focus:bg-white resize-y"
                  placeholder="Detailed product description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 bg-gray-50/50 focus:bg-white"
                  placeholder="e.g. Nike"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={categories.find(cat => cat.slug === category)?.name || ""}
                    onChange={(e) => {
                      const selectedCategory = categories.find(cat => cat.name === e.target.value);
                      setCategory(selectedCategory?.slug || "");
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 bg-gray-50/50 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Status Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-indigo-500 pl-3">Pricing & Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Base Price ($)</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 bg-gray-50/50 focus:bg-white"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 bg-gray-50/50 focus:bg-white"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">New Arrival</span>
                  <span className="text-xs text-gray-500">Mark this product as new</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={e => setIsNew(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">On Sale</span>
                  <span className="text-xs text-gray-500">Put this product on sale</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sale}
                    onChange={e => setSale(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product Variants</h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {variants.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 text-sm">
                  No variants added yet. Click &quot;Add Variant&quot; to define size/color options.
                </div>
              )}
              {variants.map((variant, idx) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 items-end">
                  <div className="w-full md:w-1/4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
                    <input
                      value={variant.sku || ""}
                      onChange={e => handleVariantChange(idx, "sku", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                      placeholder="SKU-123"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Size</label>
                    <input
                      value={variant.size || ""}
                      onChange={e => handleVariantChange(idx, "size", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                      placeholder="XL"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                    <input
                      value={variant.color || ""}
                      onChange={e => handleVariantChange(idx, "color", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                      placeholder="Red"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Image Idx</label>
                    <input
                      type="number"
                      value={variant.image_id?.toString() ?? ""}
                      onChange={e => handleVariantChange(idx, "image_id", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                      placeholder="0"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-indigo-500 pl-3">Product Images</h3>

            <div className={`border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-indigo-400 transition-colors text-center ${(existingImages.length + images.length) >= 10 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
              <div className="flex flex-col items-center justify-center relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={(existingImages.length + images.length) >= 10}
                />
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB (Max 10 images)</p>
              </div>
            </div>

            {(existingImages.length > 0 || images.length > 0) && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((imageUrl, idx) => (
                  <div key={`existing-${idx}`} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square">
                    <img src={buildAssetUrl(imageUrl)} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveExistingImage(idx)} className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/90 text-white text-[10px] uppercase font-bold text-center py-0.5">Existing</div>
                  </div>
                ))}

                {/* New Images */}
                {images.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square">
                    <img src={URL.createObjectURL(file)} alt={`New ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/90 text-white text-[10px] uppercase font-bold text-center py-0.5">New</div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 text-right">
              Total: {existingImages.length + images.length} / 10 images
            </p>
          </div>

          <div className="pt-6 flex flex-col-reverse md:flex-row gap-4 border-t border-gray-100">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full md:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-8 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${onCancel ? 'ml-auto' : 'w-full'}`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                initialData ? "Update Product" : "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}