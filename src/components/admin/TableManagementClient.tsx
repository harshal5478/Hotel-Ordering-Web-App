'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Copy,
  Printer,
  Loader2,
  Check,
  Search,
} from 'lucide-react';
import { Table } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getSiteUrl } from '@/lib/env';
import {
  createTableAction,
  updateTableAction,
  toggleTableActiveAction,
  deleteTableAction,
} from '@/actions/table';
import { PrintableQRModal } from './PrintableQRModal';
import { toast } from 'sonner';

interface TableManagementClientProps {
  initialTables: Table[];
}

export function TableManagementClient({
  initialTables,
}: TableManagementClientProps) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [previewTable, setPreviewTable] = useState<Table | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form state
  const [tableNumber, setTableNumber] = useState<number | ''>('');
  const [qrToken, setQrToken] = useState('');
  const [isActive, setIsActive] = useState(true);

  const siteUrl = getSiteUrl();

  const openCreateModal = () => {
    setEditingTable(null);
    const nextNumber =
      tables.length > 0
        ? Math.max(...tables.map((t) => t.table_number)) + 1
        : 1;
    setTableNumber(nextNumber);
    setQrToken(`qr-table-${nextNumber}-tok-${Math.random().toString(36).substring(2, 7)}`);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (tbl: Table) => {
    setEditingTable(tbl);
    setTableNumber(tbl.table_number);
    setQrToken(tbl.qr_token);
    setIsActive(tbl.is_active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber || Number(tableNumber) <= 0) {
      toast.error('Valid positive table number is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        table_number: Number(tableNumber),
        qr_token: qrToken.trim(),
        is_active: isActive,
      };

      if (editingTable) {
        const res = await updateTableAction(editingTable.id, payload);
        if (!res.success) {
          toast.error(res.error || 'Failed to update table');
        } else {
          toast.success(`Table ${tableNumber} updated successfully!`);
          setCategoriesOrTablesUpdate(editingTable.id, payload);
          setIsModalOpen(false);
        }
      } else {
        const res = await createTableAction(payload);
        if (!res.success || !res.table) {
          toast.error(res.error || 'Failed to create table');
        } else {
          toast.success(`Table ${tableNumber} created successfully!`);
          setTables((prev) => [...prev, res.table as Table]);
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const setCategoriesOrTablesUpdate = (id: string, payload: Partial<Table>) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...payload } : t))
    );
  };

  const handleToggleActive = async (tbl: Table) => {
    const newStatus = !tbl.is_active;
    try {
      const res = await toggleTableActiveAction(tbl.id, newStatus);
      if (!res.success) {
        toast.error(res.error || 'Failed to toggle status');
      } else {
        toast.success(`Table ${tbl.table_number} marked as ${newStatus ? 'Active' : 'Inactive'}`);
        setTables((prev) =>
          prev.map((t) => (t.id === tbl.id ? { ...t, is_active: newStatus } : t))
        );
      }
    } catch {
      toast.error('Failed to update table status');
    }
  };

  const handleDelete = async (tbl: Table) => {
    if (
      !confirm(
        `Are you sure you want to delete Table ${tbl.table_number}? If active orders exist, it will be deactivated instead.`
      )
    ) {
      return;
    }

    try {
      const res = await deleteTableAction(tbl.id);
      if (!res.success) {
        toast.error(res.error || 'Delete failed');
      } else if (res.softDeleted) {
        toast.info(res.message);
        setTables((prev) =>
          prev.map((t) => (t.id === tbl.id ? { ...t, is_active: false } : t))
        );
      } else {
        toast.success(`Table ${tbl.table_number} deleted`);
        setTables((prev) => prev.filter((t) => t.id !== tbl.id));
      }
    } catch {
      toast.error('Failed to delete table');
    }
  };

  const handleCopyMenuUrl = async (token: string) => {
    const url = `${siteUrl}/menu?table=${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      toast.success('Table Menu URL copied to clipboard!');
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const filteredTables = tables.filter(
    (t) =>
      t.table_number.toString().includes(searchQuery) ||
      t.qr_token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Tables & QR Codes Management
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Assign dining tables, generate stable QR tokens, and print tent cards.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex items-center space-x-2 font-bold text-xs h-10 px-4 bg-amber-500 text-stone-950 hover:bg-amber-400"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add New Table</span>
        </Button>
      </div>

      {/* Filter Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
        <Input
          placeholder="Filter by table number or token..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs"
        />
      </div>

      {/* Grid of Table Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.length > 0 ? (
          filteredTables.map((tbl) => {
            const menuUrl = `${siteUrl}/menu?table=${tbl.qr_token}`;

            return (
              <Card
                key={tbl.id}
                className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3.5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Table Header & Status */}
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                      Table {tbl.table_number}
                    </span>

                    <button onClick={() => handleToggleActive(tbl)}>
                      {tbl.is_active ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-700">
                          <XCircle className="h-3 w-3" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* QR Code Graphic Container */}
                  <div
                    onClick={() => setPreviewTable(tbl)}
                    className="my-3 p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-center cursor-pointer hover:border-amber-500/50 transition-all group"
                  >
                    <QRCodeSVG
                      value={menuUrl}
                      size={110}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <p className="text-[10px] text-stone-400 font-mono truncate text-center px-1 mb-1">
                    Token: {tbl.qr_token}
                  </p>
                </div>

                {/* Table Actions */}
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTable(tbl)}
                      className="text-[11px] font-bold h-8 border-stone-200 dark:border-stone-800"
                    >
                      <Printer className="h-3.5 w-3.5 mr-1 text-amber-500" />
                      <span>Print QR</span>
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopyMenuUrl(tbl.qr_token)}
                      className="text-[11px] font-bold h-8"
                    >
                      {copiedToken === tbl.qr_token ? (
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 mr-1 text-stone-500" />
                      )}
                      <span>Copy URL</span>
                    </Button>
                  </div>

                  <div className="flex justify-end space-x-1.5 pt-1">
                    <button
                      onClick={() => openEditModal(tbl)}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 text-stone-600 dark:text-stone-300"
                      title="Edit Table"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tbl)}
                      className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50"
                      title="Delete Table"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full p-8 text-center text-stone-400 text-xs border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
            No dining tables configured. Click &quot;Add New Table&quot; to assign tables.
          </div>
        )}
      </div>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <Card className="w-full max-w-md bg-stone-900 border-stone-800 text-stone-100 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">
              {editingTable ? 'Edit Dining Table' : 'Add New Dining Table'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">Table Number *</label>
                <Input
                  type="number"
                  min="1"
                  value={tableNumber}
                  onChange={(e) =>
                    setTableNumber(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                  }
                  placeholder="e.g. 12"
                  className="bg-stone-950 border-stone-800 text-white font-extrabold text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">Secure QR Token</label>
                <Input
                  value={qrToken}
                  onChange={(e) => setQrToken(e.target.value)}
                  placeholder="e.g. qr-tbl-12-tok-abc123"
                  className="bg-stone-950 border-stone-800 text-white font-mono text-xs"
                />
                <p className="text-[10px] text-stone-500">
                  Unique token used in QR URL (`/menu?table=&lt;token&gt;`).
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-bold text-stone-300 mb-1 block">Table Status</label>
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-stone-800 text-amber-500 focus:ring-amber-500 h-4 w-4"
                  />
                  <span className="text-stone-300 font-semibold">Active & Ordering Enabled</span>
                </label>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-stone-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 text-xs border-stone-800 text-stone-300"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : editingTable ? (
                    'Save Table'
                  ) : (
                    'Create Table'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Printable QR Tent Card Modal */}
      {previewTable && (
        <PrintableQRModal
          table={previewTable}
          onClose={() => setPreviewTable(null)}
        />
      )}
    </div>
  );
}
