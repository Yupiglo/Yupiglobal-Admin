"use client";
import React, { useState } from "react";
import InputField from "../SharedComponents/InputField";
import Button from "../SharedComponents/Button";
import { toast } from "react-toastify";
import Box from "../SharedComponents/Box";
import { useAuth } from "@/context/AuthContext";
import { buildApiUrl } from "@/utils/apiBase";

export default function BannerForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [subTitle1, setSubTitle1] = useState("");
  const [btn, setBtn] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [topBanner, setTopBanner] = useState(false);
  const [promotionalBanner, setPromotionalBanner] = useState(false);
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const token = user.token;
  const [image, setImage] = useState<File | string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      const response = await fetch(buildApiUrl("banner"), {
        method: "POST",
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

      toast.success("Banner created successfully!");
      if (onSuccess) onSuccess();
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
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Add New Banner
          </h2>
          <p className="text-sm text-gray-500 mt-1">Create a new banner for your storefront</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Title 1"
              id="title1"
              name="title1"
              value={title1}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              onChange={e => setTitle1(e.target.value)}
              required
            />
            <InputField
              label="Title 2"
              id="title2"
              name="title2"
              value={title2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              onChange={e => setTitle2(e.target.value)}
              required
            />
            <InputField
              label="Sub Title 1"
              id="subTitle1"
              name="subTitle1"
              value={subTitle1}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              onChange={e => setSubTitle1(e.target.value)}
              required
            />
            <InputField
              label="Button Text"
              id="btn"
              name="btn"
              value={btn}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              onChange={e => setBtn(e.target.value)}
              required
            />
            <InputField
              label="Category"
              id="category"
              name="category"
              value={category}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              onChange={e => setCategory(e.target.value)}
              required
            />
            <InputField
              label="Order"
              id="order"
              name="order"
              type="number"
              value={order}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              onChange={e => setOrder(Number(e.target.value))}
            />

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Banner Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-200 rounded-xl"
                />
                {imageBase64 && (
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                    <img src={imageBase64} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" checked={topBanner} onChange={() => setTopBanner(!topBanner)} />
                  <div className="block bg-gray-200 w-10 h-6 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Top Banner</span>
              </label>

              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" checked={promotionalBanner} onChange={() => setPromotionalBanner(!promotionalBanner)} />
                  <div className="block bg-gray-200 w-10 h-6 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Promotional Banner</span>
              </label>

              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" checked={isActive} onChange={() => setIsActive(!isActive)} />
                  <div className="block bg-gray-200 w-10 h-6 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">Active Status</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              text={isSubmitting ? "Creating Banner..." : "Create Banner"}
              btnType="submit"
              className={`px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}