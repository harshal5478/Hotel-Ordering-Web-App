'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  Upload,
  Utensils,
} from 'lucide-react';
import { MenuItem, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import {
  createMenuItemAction,
  updateMenuItemAction,
  toggleMenuItemAvailabilityAction,
  deleteMenuItemAction,
  uploadMenuImageAction,
} from '@/actions/menu';
import { toast } from 'sonner';

interface MenuManagementClientProps {
  initialMenuItems: (MenuItem & { category_name?: string })[];
  categories: Category[];
}

export function MenuManagementClient({
  initialMenuItems,
  categories,
}: MenuManagementClientProps) {
  const [menuItems, setMenuItems] = useState<(MenuItem & { category_name?: string })[]>(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>(0);
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(0);
    setCategoryId(categories[0]?.id || '');
    setImageUrl('');
    setIsAvailable(true);
    setSortOrder(menuItems.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || '');
    setPrice(item.price);
    setCategoryId(item.category_id);
    setImageUrl(item.image_url || '');
    setIsAvailable(item.is_available);
    setSortOrder(item.sort_order);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be 5MB or less');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadMenuImageAction(formData);
      if (!res.success || !res.imageUrl) {
        toast.error(res.error || 'Failed to upload image to Supabase Storage');
      } else {
        setImageUrl(res.imageUrl);
        toast.success('Image uploaded successfully to Storage!');
      }
    } catch {
      toast.error('An error occurred during image upload');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Dish name is required');
      return;
    }
    if (!categoryId) {
      toast.error('Please select a valid category');
      return;
    }
    if (price === '' || Number(price) < 0) {
      toast.error('Price must be 0 or greater');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        price: Number(price),
        category_id: categoryId,
        image_url: imageUrl.trim() || null,
        is_available: isAvailable,
        sort_order: Number(sortOrder) || 0,
      };

      const selectedCat = categories.find((c) => c.id === categoryId);
      const catName = selectedCat?.name || 'Uncategorized';

      if (editingItem) {
        const res = await updateMenuItemAction(editingItem.id, payload);
        if (!res.success) {
          toast.error(res.error || 'Failed to update item');
        } else {
          toast.success('Menu dish updated successfully!');
          setMenuItems((prev) =>
            prev.map((item) =>
              item.id === editingItem.id
                ? { ...item, ...payload, category_name: catName }
                : item
            )
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await createMenuItemAction(payload);
        if (!res.success || !res.menuItem) {
          toast.error(res.error || 'Failed to create item');
        } else {
          toast.success('Menu dish created successfully!');
          setMenuItems((prev) => [
            ...prev,
            { ...(res.menuItem as MenuItem), category_name: catName },
          ]);
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const newStatus = !item.is_available;
    try {
      const res = await toggleMenuItemAvailabilityAction(item.id, newStatus);
      if (!res.success) {
        toast.error(res.error || 'Failed to toggle availability');
      } else {
        toast.success(`Item marked as ${newStatus ? 'Available' : 'Unavailable'}`);
        setMenuItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_available: newStatus } : i))
        );
      }
    } catch {
      toast.error('Failed to update item status');
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (
      !confirm(
        `Are you sure you want to delete "${item.name}"? If historical order records exist, it will be marked as Unavailable instead of deleted to protect order history.`
      )
    ) {
      return;
    }

    try {
      const res = await deleteMenuItemAction(item.id);
      if (!res.success) {
        toast.error(res.error || 'Delete operation failed');
      } else if (res.softDeleted) {
        toast.info(res.message);
        setMenuItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_available: false } : i))
        );
      } else {
        toast.success('Item deleted successfully');
        setMenuItems((prev) => prev.filter((i) => i.id !== item.id));
      }
    } catch {
      toast.error('Failed to delete menu item');
    }
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      !selectedCategoryFilter || item.category_id === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Menu Management
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Add dishes, change prices, upload photos to Storage, and manage availability.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex items-center space-x-2 font-bold text-xs h-10 px-4 bg-amber-500 text-stone-950 hover:bg-amber-400"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add New Menu Dish</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search menu items by dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs"
          />
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="h-10 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Table Shell */}
      <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
            <thead className="bg-stone-50 dark:bg-stone-800/50 uppercase text-[10px] tracking-wider text-stone-500 font-bold border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="p-4">Photo</th>
                <th className="p-4">Dish Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="p-4">
                      <div className="relative h-12 w-12 rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden border border-stone-200/60 dark:border-stone-800">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-stone-400">
                            <Utensils className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <h4 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                          {item.description}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        {item.category_name}
                      </Badge>
                    </td>

                    <td className="p-4 font-black text-amber-600 dark:text-amber-400 text-sm">
                      {formatCurrency(item.price)}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className="inline-flex items-center space-x-1 cursor-pointer"
                      >
                        {item.is_available ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Available</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-rose-600 dark:text-rose-400 font-bold">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Sold Out</span>
                          </span>
                        )}
                      </button>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        title="Edit Dish"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Delete / Deactivate Dish"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400 text-xs">
                    No dishes found. Click &quot;Add New Menu Dish&quot; to create one.
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
          <Card className="w-full max-w-lg bg-stone-900 border-stone-800 text-stone-100 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-white">
              {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">Dish Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Paneer Tikka Angara"
                  className="bg-stone-950 border-stone-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-lg border border-stone-800 bg-stone-950 text-white text-xs font-semibold"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300">Price (₹) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                    }
                    placeholder="e.g. 420.00"
                    className="bg-stone-950 border-stone-800 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Cottage cheese marinated in spicy smoked yogurt & roasted in tandoor..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 h-16 resize-none"
                />
              </div>

              {/* Supabase Storage Image Upload */}
              <div className="space-y-2 p-3 bg-stone-950 rounded-xl border border-stone-800">
                <label className="font-bold text-stone-300 block">Food Image (Storage)</label>
                <div className="flex items-center space-x-3">
                  <div className="relative h-14 w-14 rounded-lg bg-stone-900 overflow-hidden border border-stone-800 shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-stone-500">
                        <Utensils className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs cursor-pointer">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Choose File to Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-stone-400">
                      Uploads directly to Supabase Storage (Max 5MB).
                    </p>
                  </div>
                </div>
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
                  <label className="font-bold text-stone-300 mb-2">Availability</label>
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded border-stone-800 text-amber-500 focus:ring-amber-500 h-4 w-4"
                    />
                    <span className="text-stone-300">Available to Order</span>
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
                  disabled={submitting || uploadingImage}
                  className="flex-1 text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : editingItem ? (
                    'Save Changes'
                  ) : (
                    'Add Dish'
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
