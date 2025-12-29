"use client";
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Activity, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import Box from "../SharedComponents/Box";

// Dummy data for transactions since no API was provided
const dummyTransactions = Array.from({ length: 15 }).map((_, i) => ({
  id: `TRX-${1000 + i}`,
  status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Failed",
  amount: (Math.random() * 500).toFixed(2),
  type: i % 2 === 0 ? "Income" : "Refund",
  date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  paymentMethod: i % 2 === 0 ? "Credit Card" : "PayPal",
  customer: `Customer ${i + 1}`
}));

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter and Pagination
  const filteredTransactions = dummyTransactions.filter(trx =>
    trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="text-gray-500 mt-1">Monitor financial activity and payments</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <div className="p-1.5 bg-green-50 rounded-lg text-green-600"><ArrowUpRight size={16} /></div>
            <div>
              <p className="text-xs text-gray-500">Total Income</p>
              <p className="text-sm font-bold text-gray-900">$12,450.00</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <div className="p-1.5 bg-red-50 rounded-lg text-red-600"><ArrowDownLeft size={16} /></div>
            <div>
              <p className="text-xs text-gray-500">Refunds</p>
              <p className="text-sm font-bold text-gray-900">$450.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search transaction ID or customer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50/50 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Transaction ID</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y divide-gray-50">
          {currentItems.map((trx) => (
            <div key={trx.id} className="group p-4 hover:bg-gray-50/50 transition-colors duration-200">
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                {/* ID & Type */}
                <div className="col-span-3 w-full flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${trx.type === 'Income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-medium text-gray-900">{trx.id}</p>
                    <p className="text-xs text-gray-500">{trx.paymentMethod}</p>
                  </div>
                </div>

                {/* Customer */}
                <div className="col-span-3 w-full flex md:block items-center justify-between">
                  <span className="md:hidden text-sm font-medium text-gray-500">Customer:</span>
                  <span className="text-sm font-medium text-gray-900">{trx.customer}</span>
                </div>

                {/* Date */}
                <div className="col-span-2 w-full flex md:block items-center justify-between">
                  <span className="md:hidden text-sm font-medium text-gray-500">Date:</span>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-sm">{new Date(trx.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="col-span-2 w-full flex md:block items-center justify-between">
                  <span className="md:hidden text-sm font-medium text-gray-500">Amount:</span>
                  <span className={`font-bold ${trx.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {trx.type === 'Income' ? '+' : '-'}${trx.amount}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 w-full flex justify-end">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(trx.status)}`}>
                    {trx.status}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} entries
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

      </div>
    </div>
  );
}
