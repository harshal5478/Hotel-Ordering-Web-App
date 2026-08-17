'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  createCategoryAction,
  updateCategoryAction,
  toggleCategoryActiveAction,
  deleteCategoryAction,
} from '@/actions/menu';
import { toast } from 'sonner';

interface CategoryManagementClientProps {
  initialCategories: Category[];
}

export function CategoryManagementClient({
  initialCategories,
}: CategoryManagementClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setSortOrder(cat.sort_order);
    setIsActive(cat.is_active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        sort_order: Number(sortOrder) || 0,
        is_active: isActive,
      };

      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, payload);
        if (!res.success) {
          toast.error(res.error || 'Failed to update category');
        } else {
          toast.success('Category updated successfully!');
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id ? { ...c, ...payload } : c
            )
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await createCategoryAction(payload);
        if (!res.success || !res.category) {
          toast.error(res.error || 'Failed to create category');
        } else {
          toast.success('Category created successfully!');
          setCategories((prev) => [...prev, res.category as Category]);
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    const newStatus = !cat.is_active;
    try {
      const res = await toggleCategoryActiveAction(cat.id, newStatus);
      if (!res.success) {
        toast.error(res.error || 'Failed to toggle status');
      } else {
        toast.success(`Category ${newStatus ? 'activated' : 'deactivated'}`);
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, is_active: newStatus } : c))
        );
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Are you sure you want to delete or deactivate category "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await deleteCategoryAction(cat.id);
      if (!res.success) {
        toast.error(res.error || 'Delete failed');
      } else if (res.softDeleted) {
        toast.info(res.message);
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, is_active: false } : c))
        );
      } else {
        toast.success('Category deleted');
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      }
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Menu Categories
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Create, edit, sort, and activate/deactivate food categories.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex items-center space-x-2 font-bold text-xs h-10 px-4 bg-amber-500 text-stone-950 hover:bg-amber-400"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
        <Input
          placeholder="Filter categories by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs"
        />
      </div>

      {/* Categories Card Table */}
      <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
            <thead className="bg-stone-50 dark:bg-stone-800/50 uppercase text-[10px] tracking-wider text-stone-500 font-bold border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="p-4">Sort Order</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      #{cat.sort_order}
                    </td>
                    <td className="p-4 font-extrabold text-stone-900 dark:text-stone-100">
                      {cat.name}
                    </td>
                    <td className="p-4 text-stone-500 dark:text-stone-400 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className="inline-flex items-center space-x-1 cursor-pointer"
                      >
                        {cat.is_active ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-stone-400 font-bold">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Disabled</span>
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        title="Edit Category"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 text-xs">
                    No categories found. Click &quot;Add New Category&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <Card className="w-full max-w-md bg-stone-900 border-stone-800 text-stone-100 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">Category Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Starters & Appetizers"
                  className="bg-stone-950 border-stone-800 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Fresh salads, soups, and hot starters..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">Sort Order</label>
                  <Input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                    className="bg-stone-950 border-stone-800 text-white"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="font-bold text-stone-300 mb-2">Status</label>
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-stone-800 text-amber-500 focus:ring-amber-500 h-4 w-4"
                    />
                    <span className="text-stone-300">Active</span>
                  </label>
                </div>
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
                  ) : editingCategory ? (
                    'Save Changes'
                  ) : (
                    'Create Category'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
