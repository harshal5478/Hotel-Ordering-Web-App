'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Order, OrderStatus, Table } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderDetailModal } from './OrderDetailModal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAdminOrders } from '@/actions/orderManagement';
import { toast } from 'sonner';

interface AdminOrdersClientProps {
  initialOrders: Order[];
  initialTotalCount: number;
  initialTotalPages: number;
  tables: Table[];
}

export function AdminOrdersClient({
  initialOrders,
  initialTotalCount,
  initialTotalPages,
  tables,
}: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [period, setPeriod] = useState<'today' | '7days' | 'all'>('today');
  const [tableId, setTableId] = useState<string>('ALL');

  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchFilteredOrders = async (
    page: number = 1,
    overrides?: {
      search?: string;
      status?: OrderStatus | 'ALL';
      period?: 'today' | '7days' | 'all';
      tableId?: string;
    }
  ) => {
    setLoading(true);
    try {
      const res = await getAdminOrders({
        page,
        pageSize: 10,
        search: overrides?.search !== undefined ? overrides.search : search,
        status: overrides?.status !== undefined ? overrides.status : status,
        period: overrides?.period !== undefined ? overrides.period : period,
        tableId: overrides?.tableId !== undefined ? overrides.tableId : tableId,
      });

      setOrders(res.orders);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
      setCurrentPage(res.currentPage);
    } catch {
      toast.error('Failed to query orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredOrders(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchFilteredOrders(newPage);
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Order Management & History
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Filter, search, inspect itemized snapshots, and manage order statuses.
          </p>
        </div>

        <div className="text-xs font-bold text-stone-500 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3.5 py-2 rounded-xl">
          Total Orders Found: <span className="text-amber-600 dark:text-amber-400 font-extrabold">{totalCount}</span>
        </div>
      </div>

      {/* Search & Filtering Toolbar */}
      <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search by order ID, guest name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => {
                const newStatus = e.target.value as OrderStatus | 'ALL';
                setStatus(newStatus);
                fetchFilteredOrders(1, { status: newStatus });
              }}
              className="h-10 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="PREPARING">PREPARING</option>
              <option value="READY">READY</option>
              <option value="SERVED">SERVED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            {/* Table Filter */}
            <select
              value={tableId}
              onChange={(e) => {
                const newTableId = e.target.value;
                setTableId(newTableId);
                fetchFilteredOrders(1, { tableId: newTableId });
              }}
              className="h-10 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              <option value="ALL">All Dining Tables</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  Table {t.table_number}
                </option>
              ))}
            </select>

            {/* Period Filter */}
            <select
              value={period}
              onChange={(e) => {
                const newPeriod = e.target.value as 'today' | '7days' | 'all';
                setPeriod(newPeriod);
                fetchFilteredOrders(1, { period: newPeriod });
              }}
              className="h-10 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="all">All Time</option>
            </select>

            <Button
              type="submit"
              disabled={loading}
              className="h-10 px-4 font-bold text-xs bg-amber-500 text-stone-950 hover:bg-amber-400"
            >
              <Filter className="h-3.5 w-3.5 mr-1" />
              <span>Apply Filters</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Orders Table */}
      <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
            <thead className="bg-stone-50 dark:bg-stone-800/50 uppercase text-[10px] tracking-wider text-stone-500 font-bold border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Table</th>
                <th className="p-4">Guest</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {orders.length > 0 ? (
                orders.map((ord) => {
                  const shortId = ord.id.slice(0, 8).toUpperCase();
                  const tableNum = ord.tables?.table_number || '?';
                  const itemCount = ord.order_items?.length || 0;
                  const formattedTime = new Date(ord.created_at).toLocaleString([], {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  });

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                        #{shortId}
                      </td>

                      <td className="p-4 font-black text-amber-600 dark:text-amber-400">
                        Table {tableNum}
                      </td>

                      <td className="p-4 font-medium text-stone-700 dark:text-stone-300">
                        {ord.customer_name || '—'}
                      </td>

                      <td className="p-4 font-semibold text-stone-600 dark:text-stone-400">
                        {itemCount} item{itemCount === 1 ? '' : 's'}
                      </td>

                      <td className="p-4 font-black text-stone-900 dark:text-stone-100">
                        {formatCurrency(ord.total_amount)}
                      </td>

                      <td className="p-4">
                        <OrderStatusBadge status={ord.status} />
                      </td>

                      <td className="p-4 text-stone-400 font-medium">{formattedTime}</td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center space-x-1 ml-auto"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-500" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400 text-xs">
                    No orders match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">
              Page <span className="font-bold text-stone-900 dark:text-stone-100">{currentPage}</span> of{' '}
              <span className="font-bold text-stone-900 dark:text-stone-100">{totalPages}</span> ({totalCount} total orders)
            </span>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                className="text-xs font-bold"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Previous</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
                className="text-xs font-bold"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}
