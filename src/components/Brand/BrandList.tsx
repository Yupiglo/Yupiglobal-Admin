"use client";
import { useState, useEffect } from "react";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BrandForm from "./Brand";
import { Edit2, Trash2, Plus, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";

export default function BrandList() {
    const router = useRouter();
    const { user } = useAuth();
    const token = user.token;

    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit/Add form state
    const [editBrand, setEditBrand] = useState<any | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Fetch brands
    const fetchBrands = () => {
        setLoading(true);
        fetch(buildApiUrl("brands"), {
            headers: { Authorization: token }
        })
            .then(res => res.json())
            .then(data => setBrands(data.getAllBrands || []))
            .catch(() => toast.error("Failed to fetch brands"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // Handle Delete
    const handleDelete = (brand: any) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) return;
        fetch(buildApiUrl(`brands/${brand._id}`), {
            method: "DELETE",
            headers: { Authorization: token }
        })
            .then(res => {
                if (!res.ok) throw new Error("Delete failed");
                toast.success("Brand deleted!");
                fetchBrands();
            })
            .catch(() => toast.error("Failed to delete brand"));
    };

    const closeDrawer = () => {
        setEditBrand(null);
        setIsAddMode(false);
        fetchBrands(); // Refresh list to catch updates
    };

    // Filter and Pagination Logic
    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brand.slug && brand.slug.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Brand Management</h2>
                    <p className="text-gray-500 mt-1">Manage partner brands and logos</p>
                </div>
                <button
                    onClick={() => setIsAddMode(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
                >
                    <Plus size={20} />
                    Add Brand
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search brands..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading brands...</div>
                ) : filteredBrands.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No brands found matching your search.</div>
                ) : (
                    <>
                        {/* Desktop Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50/50 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-5">Brand Details</div>
                            <div className="col-span-4">Slug</div>
                            <div className="col-span-3 text-right">Actions</div>
                        </div>

                        {/* Brand Rows */}
                        <div className="divide-y divide-gray-50">
                            {currentItems.map((brand) => (
                                <div key={brand._id} className="group p-4 hover:bg-indigo-50/30 transition-colors duration-200">
                                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                                        {/* Brand Details */}
                                        <div className="col-span-5 w-full flex items-center gap-4">
                                            <div className="h-14 w-14 min-w-[3.5rem] rounded-xl overflow-hidden bg-white border border-gray-100 p-1">
                                                {brand.Image ? (
                                                    <img src={brand.Image} alt={brand.name} className="w-full h-full object-contain rounded-lg" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 rounded-lg text-xs">No Logo</div>
                                                )}
                                            </div>
                                            <span className="font-semibold text-gray-900">{brand.name}</span>
                                        </div>

                                        {/* Slug */}
                                        <div className="col-span-4 w-full flex md:block items-center justify-between">
                                            <span className="md:hidden text-sm font-medium text-gray-500">Slug:</span>
                                            <code className="px-2 py-1 rounded bg-gray-50 text-gray-600 text-xs font-mono border border-gray-100">
                                                {brand.slug}
                                            </code>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-3 w-full flex justify-end gap-2 mt-2 md:mt-0">
                                            <button
                                                onClick={() => setEditBrand(brand)}
                                                className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                title="Edit Brand"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(brand)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Brand"
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
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBrands.length)} of {filteredBrands.length} entries
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

            {/* Edit/Add Drawer (Sliding Modal) */}
            {/* Overlay */}
            {(editBrand || isAddMode) && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={closeDrawer}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${(editBrand || isAddMode) ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900">
                            {isAddMode ? "Add New Brand" : "Edit Brand"}
                        </h2>
                        <button
                            onClick={closeDrawer}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {(editBrand || isAddMode) && (
                            <BrandForm
                                initialData={editBrand} // Will be null for Add Mode
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