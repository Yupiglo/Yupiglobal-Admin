"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Box from "../SharedComponents/Box";
import Button from "../SharedComponents/Button";
import { buildApiUrl } from "@/utils/apiBase";

export default function BlogListPage() {
    const { user } = useAuth();
    const token = user.token;
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editBlog, setEditBlog] = useState<any | null>(null);

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

    // Fetch all blogs
    const fetchBlogs = () => {
        setLoading(true);
        fetch(buildApiUrl("blogs"), {
            headers: { Authorization: token }
        })
            .then(res => res.json())
            .then(data => setBlogs(data.posts || []))
            .catch(() => toast.error("Failed to fetch blogs"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

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

    // Handle Edit
    const handleEdit = (blog: any) => {
        setEditBlog(blog);
        setTitle(blog.title);
        setImageBase64(blog.Image || "");
        if (editor) editor.commands.setContent(blog.content || "");
    };

    // Handle Delete
    const handleDelete = (blog: any) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        fetch(buildApiUrl(`blogs/${blog._id}`), {
            method: "DELETE",
            headers: { Authorization: token }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to delete");
                toast.success("Blog deleted!");
                fetchBlogs();
            })
            .catch(() => toast.error("Failed to delete blog"));
    };

    // Handle Update (Edit Submit)
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            title,
            content: editor?.getHTML() || "",
            author: user.username || user.email || "Unknown",
            Image: imageBase64,
            isPublish: editBlog.isPublish,
        };

        fetch(buildApiUrl(`blogs/${editBlog._id}`), {
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
                toast.success("Blog updated successfully!");
                setEditBlog(null);
                setTitle("");
                setImage(null);
                setImageBase64("");
                if (editor) editor.commands.setContent("");
                fetchBlogs();
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
        setEditBlog(null);
        setTitle("");
        setImage(null);
        setImageBase64("");
        if (editor) editor.commands.setContent("");
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Card */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Blog Posts
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your blog content</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/addblogs")}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                    >
                        Create New Post
                    </button>
                </div>
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
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / Date</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="group hover:bg-blue-50/30 transition-colors duration-200">
                                        <td className="py-4 px-6">
                                            <div className="h-16 w-24 rounded-lg overflow-hidden ring-1 ring-gray-100 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                                                {blog.Image ? (
                                                    <img
                                                        src={blog.Image}
                                                        alt={blog.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 line-clamp-1">{blog.title}</span>
                                                <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                    {blog.date ? new Date(blog.date).toLocaleDateString() : "No Date"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${blog.isPublish
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${blog.isPublish ? "bg-green-500" : "bg-yellow-500"}`}></span>
                                                {blog.isPublish ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => handleEdit(blog)}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog)}
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
            {editBlog && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={handleCancelEdit} />

                    {/* Sliding Panel - Wider for Blog Editor */}
                    <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Edit Blog Post</h2>
                                <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        maxLength={100}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                    <div className="border border-gray-200 rounded-xl bg-gray-50/30 min-h-[200px] p-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all prose prose-sm max-w-none">
                                        {editor && <EditorContent editor={editor} className="outline-none min-h-[180px]" />}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    {imageBase64 && (
                                        <div className="mt-4 relative rounded-xl overflow-hidden border border-gray-100 shadow-sm w-full h-48">
                                            <img
                                                src={imageBase64}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        className="flex-1 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Updating..." : "Update Post"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}