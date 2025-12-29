"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Save, Loader, MapPin, Phone, Mail, Globe } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";

export default function Settings() {
    const { user } = useAuth();
    const token = user.token;

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [siteName, setSiteName] = useState("");

    // Fetch existing settings
    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                // Assuming endpoint 'settings/general' exists or we use a singular resource
                const res = await fetch(buildApiUrl("settings/general"), {
                    headers: { Authorization: token },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setPhone(data.phone || "");
                        setAddress(data.address || "");
                        setEmail(data.email || "");
                        setSiteName(data.siteName || "");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
                // Don't toast error on load as it might arguably be empty initially
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
        // eslint-disable-next-line
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch(buildApiUrl("settings/general"), {
                method: "PUT", // or POST depending on API design
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    phone,
                    address,
                    email,
                    siteName
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to save settings");
            }

            toast.success("Settings updated successfully!");
        } catch (err: any) {
            toast.error(err.message || "An error occurred while saving");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
                <p className="text-gray-500 mt-1">Manage your website's contact information and global details.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader className="animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="p-8 space-y-8">

                            {/* Site Identity Section (Optional but good to have) */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Globe size={20} className="text-indigo-500" />
                                    Site Identity
                                </h3>
                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Website Name</label>
                                        <input
                                            type="text"
                                            value={siteName}
                                            onChange={(e) => setSiteName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                            placeholder="e.g. My Awesome Store"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Contact Info Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Phone size={20} className="text-green-500" />
                                    Contact Information
                                </h3>
                                <div className="grid gap-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                    placeholder="support@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                            <textarea
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all min-h-[100px]"
                                                placeholder="123 Commerce St, City, Country"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 font-medium disabled:opacity-70 disabled:transform-none"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
