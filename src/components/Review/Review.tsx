"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { Star, MoreHorizontal, User, Calendar, MessageSquare, Check, X, Clock, Trash2, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";

export default function Review() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const { user } = useAuth();
  const token = user.token;

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchReviews = () => {
    setLoading(true);
    fetch(buildApiUrl("review"), {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => setReviews(data.getAllReviews || []))
      .catch(() => toast.error("Failed to fetch reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  const handleUpdateStatus = (reviewId: string, newStatus: string) => {
    // If optimistic UI update is desired, can update state here before fetch
    fetch(buildApiUrl(`review/${reviewId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        toast.success(`Review ${newStatus}!`);
        // Update local state and selectedReview
        setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, status: newStatus } : r));
        if (selectedReview && selectedReview._id === reviewId) {
          setSelectedReview({ ...selectedReview, status: newStatus });
        }
      })
      .catch(() => toast.error("Failed to update status"));
  };

  const handleDelete = (review: any) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    fetch(buildApiUrl(`review/${review._id}`), {
      method: "DELETE",
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Review deleted!");
        setReviews(prev => prev.filter(r => r._id !== review._id));
        if (selectedReview && selectedReview._id === review._id) {
          closeDrawer();
        }
      })
      .catch(() => toast.error("Failed to delete review"));
  };

  const closeDrawer = () => {
    setSelectedReview(null);
  };

  // Render Stars
  const renderStars = (rate: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < rate ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
    );
  };

  // Filter and Pagination Logic
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.userId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Reviews</h2>
          <p className="text-gray-500 mt-1">Manage user reviews and feedback</p>
        </div>
        {/* Status Filter Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === status
                ? 'bg-gray-100 text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search reviews or users..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Review List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No reviews found.</div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50/50 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Review Content</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-2">User</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {currentItems.map((review) => (
                <div key={review._id} className="group p-4 hover:bg-gray-50/50 transition-colors duration-200">
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                    {/* Content */}
                    <div className="col-span-4 w-full">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{review.text}</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "-"}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="col-span-2 w-full flex md:block items-center justify-between">
                      <span className="md:hidden text-sm font-medium text-gray-500">Rating:</span>
                      {renderStars(Number(review.rate))}
                    </div>

                    {/* User */}
                    <div className="col-span-2 w-full flex md:block items-center justify-between">
                      <span className="md:hidden text-sm font-medium text-gray-500">User:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                          {(review.userId?.name || review.userId || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700 truncate max-w-[100px]" title={review.userId?.name || review.userId}>
                          {review.userId?.name || review.userId || "Unknown"}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 w-full flex md:block items-center justify-between">
                      <span className="md:hidden text-sm font-medium text-gray-500">Status:</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                        {review.status || "pending"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 w-full flex justify-end gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Review"
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReviews.length)} of {filteredReviews.length} entries
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

      {/* Review Details Drawer */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="h-full flex flex-col">

              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
                <button onClick={closeDrawer} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-lg font-bold text-indigo-600">
                    {(selectedReview.userId?.name || selectedReview.userId || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedReview.userId?.name || selectedReview.userId || "Unknown User"}</h3>
                    <p className="text-gray-500 text-xs">Customer</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={14} />
                      {selectedReview.createdAt ? new Date(selectedReview.createdAt).toLocaleDateString() : "No Date"}
                    </div>
                    <div className="flex">
                      {renderStars(Number(selectedReview.rate))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Review Text</span>
                    <p className="text-gray-700 italic">"{selectedReview.text}"</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Product ID</span>
                    <code className="bg-white px-2 py-1 rounded border border-gray-200 text-xs font-mono text-gray-600 block w-fit">
                      {selectedReview.productId}
                    </code>
                  </div>
                </div>

                {/* Status Actions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleUpdateStatus(selectedReview._id, 'pending')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${selectedReview.status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 ring-2 ring-yellow-500/20' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Clock size={16} />
                        Pending
                      </div>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedReview._id, 'approved')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${selectedReview.status === 'approved' ? 'bg-green-50 border-green-200 text-green-700 ring-2 ring-green-500/20' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Check size={16} />
                        Approve
                      </div>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedReview._id, 'rejected')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${selectedReview.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500/20' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <X size={16} />
                        Reject
                      </div>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}