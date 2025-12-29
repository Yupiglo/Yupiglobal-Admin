"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import ProductDetails from "./ProductDetails";
import ProductForm from "../AddProduct/Addproduct";
import { buildApiUrl, buildAssetUrl } from "@/utils/apiBase";
import { Edit2, Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // For View Modal
  const [editingProduct, setEditingProduct] = useState<any>(null); // For Edit Drawer
  const [isAddMode, setIsAddMode] = useState(false); // For Add Drawer

  const router = useRouter();
  const { user } = useAuth();
  const token = user.token;
  const authHeader = token?.toLowerCase?.().startsWith("bearer ") ? token : `Bearer ${token}`;

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("products"), {
        headers: {
          Accept: "application/json",
          Authorization: authHeader,
        },
      });
      const data = await res.json();
      setProducts(data.getAllProducts ?? []);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (product: any) => {
    if (!window.confirm(`Are you sure you want to delete "${product.title}"?`)) return;
    try {
      const res = await fetch(buildApiUrl(`products/${product._id}`), {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      toast.success(data.message || "Product deleted successfully!");
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  // Filter and Pagination Logic
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Drawer handling
  const closeDrawer = () => {
    setEditingProduct(null);
    setIsAddMode(false);
    // Refresh list to see updates
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-500 mt-1">Manage your catalog, inventory and specific product details</p>
        </div>
        <button
          onClick={() => setIsAddMode(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name, brand or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No products found matching your search.</div>
        ) : (
          <>
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50/50 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Product Info</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Product Rows */}
            <div className="divide-y divide-gray-50">
              {currentItems.map((product) => (
                <div key={product._id} className="group p-4 hover:bg-indigo-50/30 transition-colors duration-200">
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                    {/* Product Info */}
                    <div className="col-span-3 w-full flex items-center gap-4">
                      <div className="h-16 w-16 min-w-[4rem] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {product.imgCover ? (
                          <img src={buildAssetUrl(product.imgCover)} alt={product.title} className="w-full h-full object-cover" />
                        ) : product.images?.[0] ? (
                          <img src={buildAssetUrl(product.images[0])} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{product.brand || "No Brand"}</p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 w-full flex md:block items-center justify-between">
                      <span className="md:hidden text-sm font-medium text-gray-500">Category:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                        {product.category}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 w-full flex md:block items-center justify-between">
                      <span className="md:hidden text-sm font-medium text-gray-500">Price:</span>
                      <div>
                        <span className="font-bold text-gray-900">${product.price}</span>
                        {product.discount && (
                          <span className="ml-2 text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded">-{product.discount}%</span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 w-full flex md:block items-center justify-between gap-2">
                      <span className="md:hidden text-sm font-medium text-gray-500">Status:</span>
                      <div className="flex gap-2">
                        {product.new && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide border border-blue-100">New</span>
                        )}
                        {product.sale && (
                          <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wide border border-orange-100">Sale</span>
                        )}
                        {!product.new && !product.sale && (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 w-full flex justify-end gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} entries
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

      {/* Details Modal */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Edit/Add Drawer (Sliding Modal) */}
      {/* Overlay */}
      {(editingProduct || isAddMode) && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[800px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${(editingProduct || isAddMode) ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">
              {isAddMode ? "Add New Product" : "Edit Product"}
            </h2>
            <button
              onClick={closeDrawer}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {(editingProduct || isAddMode) && (
              <ProductForm
                initialData={editingProduct} // Will be null for Add Mode
                onSuccess={() => {
                  closeDrawer();
                }}
                onCancel={closeDrawer}
                isModal={true}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
}