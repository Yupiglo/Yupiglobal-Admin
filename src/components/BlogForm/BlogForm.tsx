"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Box from "../SharedComponents/Box";
// import Button from "../SharedComponents/Button";
import { buildApiUrl } from "@/utils/apiBase";

export default function AddBlogPage() {
    const { user } = useAuth();
    const token = user.token;
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    // Tiptap editor instance
    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[150px]',
            },
        },
        immediatelyRender: false,
    });

    // Convert image file to base64
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            title,
            content: editor?.getHTML() || "",
            author: user.username || user.email || "Unknown",
            Image: imageBase64,
            isPublish: false,
        };

        fetch(buildApiUrl("blogs"), {
            method: "POST",
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
                toast.success("Blog added successfully!");
                router.push("/bloglist");
            })
            .catch((err) => {
                toast.error(err.message || "An error occurred");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };


    return (
        <div className="p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Create New Blog
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Publish insightful content for your users</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                maxLength={100}
                                placeholder="Enter an engaging title..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                            <div className="border border-gray-200 rounded-xl bg-gray-50/30 min-h-[200px] p-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all prose prose-sm max-w-none">
                                {editor && <EditorContent editor={editor} className="outline-none min-h-[180px]" />}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <label className="flex flex-col items-center justify-center w-full md:w-64 h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 group-hover:text-blue-600"><span className="font-semibold">Click to upload</span></p>
                                        <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 800x400px)</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>

                                {imageBase64 && (
                                    <div className="relative group">
                                        <img src={imageBase64} alt="Preview" className="h-48 w-auto object-cover rounded-2xl shadow-md border border-gray-100" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-2xl"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            className={`px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Publishing..." : "Publish Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}