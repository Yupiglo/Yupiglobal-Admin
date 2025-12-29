"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../SharedComponents/Button";
import { useAuth } from "@/context/AuthContext";
import { Eye, X, Search, ChevronLeft, ChevronRight, Package, Truck, CreditCard, Calendar, User, MapPin } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { user } = useAuth();
  const token = user.token;

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchOrders = () => {
    setLoading(true);
    fetch(buildApiUrl("orders/all"), {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(data => {
        let ordersArr = [];
        if (Array.isArray(data.orders)) {
          ordersArr = data.orders;
        } else if (data.orders && typeof data.orders === "object") {
          ordersArr = [data.orders];
        }
        setOrders(ordersArr);

        // Fetch usernames for all unique userIds
        const uniqueUserIds = [
          ...new Set(
            ordersArr
              .map((order: any) => order.userId)
              .filter((id: any) => typeof id === "string")
          ),
        ] as string[];
        const userNameMap: { [key: string]: string } = {};

        Promise.all(
          uniqueUserIds.map((userId: string) => {
            return fetch(
              buildApiUrl(`users/${userId}`),
              { headers: { Authorization: token } }
            )
              .then(userRes => userRes.json())
              .then(userData => {
                if (userData?.user.name) {
                  userNameMap[userId] = userData.user.name;
                } else {
                  userNameMap[userId] = userId;
                }
              })
              .catch(() => {
                userNameMap[userId] = userId;
              });
          })
        ).then(() => {
          setUserNames(userNameMap);
        });
      })
      .catch(() => toast.error("Failed to fetch orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const closeDrawer = () => {
    setSelectedOrder(null);
  };

  // Filter and Pagination
  const filteredOrders = orders.filter(order => {
    const orderId = order._id.toLowerCase();
    const userName = (typeof order.userId === "object" ? order.userId.name : userNames[order.userId] || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return orderId.includes(search) || userName.includes(search);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-500 mt-1">Track and manage customer orders</p>
        </div>
        <div className="flex gap-3">
          {/* Potential Export Button? */}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No orders found.</div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50/50 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Order ID</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {currentItems.map((order) => {
                const customerName = typeof order.userId === "object" ? order.userId.name : userNames[order.userId] || order.userId || "Unknown";
                return (
                  <div key={order._id} className="group p-4 hover:bg-gray-50/50 transition-colors duration-200">
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                      {/* Order ID */}
                      <div className="col-span-3 w-full flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                          <Package size={18} />
                        </div>
                        <span className="font-mono text-sm font-medium text-gray-700 truncate" title={order._id}>
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>

                      {/* Customer */}
                      <div className="col-span-3 w-full flex md:block items-center justify-between">
                        <span className="md:hidden text-sm font-medium text-gray-500">Customer:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate">{customerName}</span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 w-full flex md:block items-center justify-between">
                        <span className="md:hidden text-sm font-medium text-gray-500">Date:</span>
                        <span className="text-sm text-gray-500">
                          {order.orderAt ? new Date(order.orderAt).toLocaleDateString() : "-"}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 w-full flex md:block items-center justify-between">
                        <span className="md:hidden text-sm font-medium text-gray-500">Status:</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus || "Pending"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 w-full flex justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2 text-sm"
                        >
                          <Eye size={16} />
                          <span className="md:hidden">View Details</span>
                        </button>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} entries
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

      {/* Order Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />

          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="h-full flex flex-col">

              {/* Drawer Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {selectedOrder._id}</p>
                </div>
                <button onClick={closeDrawer} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8">

                {/* Status Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Order Status</span>
                    <div className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {selectedOrder.orderStatus || "Pending"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Payment Status</span>
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedOrder.isPaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.isPaid ? "Paid" : "Unpaid"}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={16} /> Customer Information
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                        <p className="font-medium text-gray-900">
                          {typeof selectedOrder.userId === "object" ? selectedOrder.userId.name : userNames[selectedOrder.userId] || selectedOrder.userId || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order Date</p>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          <p className="font-medium text-gray-900">
                            {selectedOrder.orderAt ? new Date(selectedOrder.orderAt).toLocaleString() : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Truck size={16} /> Shipping Details
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    {selectedOrder.shippingAddress ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Address</p>
                          <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-400 mt-0.5" />
                            <p className="font-medium text-gray-900">
                              {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Contact</p>
                          <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Delivery Status</p>
                          <p className={`font-medium ${selectedOrder.isDelivered ? 'text-green-600' : 'text-orange-600'}`}>
                            {selectedOrder.isDelivered ? `Delivered at ${selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleDateString() : ''}` : "Not Delivered"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No shipping details provided.</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Package size={16} /> Order Items
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 ? (
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                          <tr>
                            <th className="px-4 py-3 font-medium">Product</th>
                            <th className="px-4 py-3 font-medium text-center">Qty</th>
                            <th className="px-4 py-3 font-medium text-right">Price</th>
                            <th className="px-4 py-3 font-medium text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedOrder.cartItems.map((item: any, idx: number) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {item.productId?.title || (typeof item.productId === 'string' ? "Product ID: " + item.productId : "Unknown Product")}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                              <td className="px-4 py-3 text-right text-gray-600">${item.price}</td>
                              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                ${(item.quantity * item.price).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-100">
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">Total Amount</td>
                            <td className="px-4 py-3 text-right font-bold text-indigo-600 text-lg">
                              ${selectedOrder.totalPrice || selectedOrder.cartItems.reduce((acc: number, item: any) => acc + (item.quantity * item.price), 0).toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                      <div className="p-6 text-center text-gray-500">No items in this order.</div>
                    )}
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