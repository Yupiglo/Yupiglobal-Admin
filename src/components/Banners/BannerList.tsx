"use client";
import React, { useState, useEffect } from "react";
import InputField from "../SharedComponents/InputField";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import Box from "../SharedComponents/Box";
import { useAuth } from "@/context/AuthContext";
import { buildApiUrl } from "@/utils/apiBase";

export default function BannerList() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const token = user.token;

    // Edit form state
    const [editBanner, setEditBanner] = useState<any | null>(null);
    const [title1, setTitle1] = useState("");
    const [title2, setTitle2] = useState("");
    const [subTitle1, setSubTitle1] = useState("");
    const [btn, setBtn] = useState("");
    const [category, setCategory] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [topBanner, setTopBanner] = useState(false);
    const [promotionalBanner, setPromotionalBanner] = useState(false);
    const [order, setOrder] = useState(0);
    const [image, setImage] = useState<File | string | null>(null);
    const [imageBase64, setImageBase64] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch(buildApiUrl("banner"), {
                headers: { Authorization: token },
            });
            const data = await res.json();
            setBanners(data.banners || []);
        } catch {
            toast.error("Failed to fetch banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
        // eslint-disable-next-line
    }, []);

    // Edit
    const handleEdit = (banner: any) => {
        setEditBanner(banner);
        setTitle1(banner.title1);
        setTitle2(banner.title2);
        setSubTitle1(banner.subTitle1);
        setBtn(banner.btn);
        setCategory(banner.category);
        setIsActive(banner.isActive);
        setTopBanner(banner.topBanner);
        setPromotionalBanner(banner.promotionalBanner);
        setOrder(banner.order);
        setImage(null);
        setImageBase64("");
    };

    // Delete
    async function handleDelete(banner: any): Promise<void> {
        if (!window.confirm(`Are you sure you want to delete the banner "${banner.title1}"?`)) return;
        try {
            const response = await fetch(buildApiUrl(`banner/${banner._id}`), {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to delete banner");
            }
            toast.success("Banner deleted successfully!");
            fetchBanners();
        } catch (err: any) {
            toast.error(err.message || "An error occurred while deleting the banner");
        }
    }

    // Image to base64 for edit
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImageBase64(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Update
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload: any = {
                title1,
                title2,
                subTitle1,
                btn,
                category,
                isActive,
                topBanner,
                promotionalBanner,
                order,
            };
            if (imageBase64) payload.Image = imageBase64;

            const response = await fetch(buildApiUrl(`banner/${editBanner._id}`), {
                method: "PUT",
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

            toast.success("Banner updated successfully!");
            setEditBanner(null);
            setImage(null);
            setImageBase64("");
            setTitle1("");
            setTitle2("");
            setSubTitle1("");
            setBtn("");
            setCategory("");
            setIsActive(true);
            setTopBanner(false);
            setPromotionalBanner(false);
            setOrder(0);
            fetchBanners();
        } catch (err: any) {
            toast.error(err.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditBanner(null);
        setImage(null);
        setImageBase64("");
        setTitle1("");
        setTitle2("");
        setSubTitle1("");
        setBtn("");
        setCategory("");
        setIsActive(true);
        setTopBanner(false);
        setPromotionalBanner(false);
        setOrder(0);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Card */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Banners List
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage all your store banners</p>
                </div>
                <div className="text-sm text-gray-400 font-medium">Total: {banners.length}</div>
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
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / Subtitle</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {banners.map((banner) => (
                                    <tr key={banner._id} className="group hover:bg-blue-50/30 transition-colors duration-200">
                                        <td className="py-4 px-6">
                                            <div className="h-16 w-24 rounded-lg overflow-hidden ring-1 ring-gray-100 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                                                {banner.Image ? (
                                                    <img
                                                        src={banner.Image}
                                                        alt={banner.title1}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 line-clamp-1">{banner.title1}</span>
                                                <span className="text-xs text-gray-500 line-clamp-1">{banner.title2}</span>
                                                <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">{banner.btn || "No Button"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                {banner.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${banner.isActive
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${banner.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                                                {banner.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                {banner.topBanner && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit">TOP</span>}
                                                {banner.promotionalBanner && <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 w-fit">PROMO</span>}
                                                {!banner.topBanner && !banner.promotionalBanner && <span className="text-xs text-gray-400">-</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 font-mono">
                                            {banner.order}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => handleEdit(banner)}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner)}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal Overlay */}
            {editBanner && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={handleCancelEdit} />

                    {/* Sliding Panel */}
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Edit Banner</h2>
                                <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-5">
                                <InputField label="Title 1" id="title1" name="title1" value={title1} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" onChange={e => setTitle1(e.target.value)} required />
                                <InputField label="Title 2" id="title2" name="title2" value={title2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" onChange={e => setTitle2(e.target.value)} required />
                                <InputField label="Sub Title" id="subTitle1" name="subTitle1" value={subTitle1} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" onChange={e => setSubTitle1(e.target.value)} required />
                                <InputField label="Button Text" id="btn" name="btn" value={btn} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" onChange={e => setBtn(e.target.value)} required />
                                <InputField label="Category" id="category" name="category" value={category} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" onChange={e => setCategory(e.target.value)} required />
                                <InputField label="Order" id="order" name="order" type="number" value={order} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" onChange={e => setOrder(Number(e.target.value))} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all border border-gray-200 rounded-lg p-1" />
                                    {imageBase64 && <img src={imageBase64} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-3 border border-gray-100" />}
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center cursor-pointer justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-700">Top Banner</span>
                                        <div className="relative">
                                            <input type="checkbox" className="peer sr-only" checked={topBanner} onChange={() => setTopBanner(!topBanner)} />
                                            <div className="block bg-gray-200 w-9 h-5 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                                            <div className="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4"></div>
                                        </div>
                                    </label>
                                    <label className="flex items-center cursor-pointer justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-700">Promotional</span>
                                        <div className="relative">
                                            <input type="checkbox" className="peer sr-only" checked={promotionalBanner} onChange={() => setPromotionalBanner(!promotionalBanner)} />
                                            <div className="block bg-gray-200 w-9 h-5 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                                            <div className="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4"></div>
                                        </div>
                                    </label>
                                    <label className="flex items-center cursor-pointer justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-700">Active Status</span>
                                        <div className="relative">
                                            <input type="checkbox" className="peer sr-only" checked={isActive} onChange={() => setIsActive(!isActive)} />
                                            <div className="block bg-gray-200 w-9 h-5 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                                            <div className="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4"></div>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <Button text="Cancel" btnType="button" className="flex-1 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors border-none" onClick={handleCancelEdit} />
                                    <Button text={isSubmitting ? "Saving..." : "Save Changes"} btnType="submit" className="flex-1 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all border-none" disabled={isSubmitting} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}