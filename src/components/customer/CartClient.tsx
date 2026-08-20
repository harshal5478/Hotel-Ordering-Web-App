'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Utensils,
  NotebookPen,
  User,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { QuantitySelector } from './QuantitySelector';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { createOrderAction } from '@/actions/order';
import { toast } from 'sonner';

interface CartClientProps {
  tableNumber: number;
}

export function CartClient({ tableNumber }: CartClientProps) {
  const router = useRouter();
  const {
    cart,
    tableId,
    updateQuantity,
    removeFromCart,
    updateItemNote,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    orderNote,
    setOrderNote,
    clearCart,
    totalItemsCount,
    subtotalAmount,
    addRecentOrderId,
  } = useCart();

  const [activeNoteInputId, setActiveNoteInputId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!tableId) {
      toast.error('Invalid dining table configuration. Please re-scan table QR code.');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        table_id: tableId,
        customer_name: customerName || undefined,
        customer_phone: customerPhone || undefined,
        order_note: orderNote || undefined,
        items: cart.map((item) => ({
          menu_item_id: item.menuItem.id,
          quantity: item.quantity,
          item_note: item.item_note || undefined,
        })),
      };

      const res = await createOrderAction(payload);

      if (!res.success || !res.orderId) {
        setErrorMessage(res.error || 'Failed to place order. Please try again.');
        toast.error(res.error || 'Failed to place order');
      } else {
        toast.success('Order placed successfully!');
        addRecentOrderId(res.orderId);
        clearCart();
        router.push(`/order/${res.orderId}`);
      }
    } catch {
      setErrorMessage('An unexpected error occurred while placing your order.');
      toast.error('An unexpected error occurred while placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (totalItemsCount === 0) {
    return (
      <div className="py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-amber-500" />
            <h1 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
              Your Order Cart
            </h1>
          </div>
          <span className="text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full">
            Table {tableNumber}
          </span>
        </div>

        <EmptyState
          icon={<ShoppingBag className="h-10 w-10 text-stone-400" />}
          title="Your Cart is Empty"
          description="You haven't added any items from the menu yet."
          action={
            <Link
              href={`/menu?table=${tableNumber}`}
              className="mt-2 inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Utensils className="h-4 w-4" />
              <span>Browse Menu Items</span>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center space-x-2">
          <Link
            href={`/menu?table=${tableNumber}`}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
            Your Order Cart
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-black bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">
            Table {tableNumber}
          </span>

          <button
            onClick={() => {
              clearCart();
              toast.info('Cart cleared');
            }}
            className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
            title="Clear Cart"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-start space-x-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cart Items List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Items ({totalItemsCount})
          </h2>
          <Link
            href={`/menu?table=${tableNumber}`}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            + Add More Items
          </Link>
        </div>

        {cart.map(({ menuItem, quantity, item_note }) => {
          const itemSubtotal = menuItem.price * quantity;
          const isNoteOpen = activeNoteInputId === menuItem.id || Boolean(item_note);

          return (
            <Card
              key={menuItem.id}
              className="p-3.5 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3 shadow-xs"
            >
              <div className="flex justify-between items-start space-x-3">
                {/* Thumbnail */}
                <div className="relative h-16 w-16 rounded-xl bg-stone-100 dark:bg-stone-800 shrink-0 overflow-hidden border border-stone-200/60 dark:border-stone-800">
                  {menuItem.image_url ? (
                    <Image
                      src={menuItem.image_url}
                      alt={menuItem.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-stone-400">
                      <Utensils className="h-6 w-6 stroke-[1.5]" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {menuItem.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(menuItem.id)}
                      className="text-stone-400 hover:text-rose-500 p-1 transition-colors shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {formatCurrency(menuItem.price)} each
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <QuantitySelector
                      quantity={quantity}
                      onIncrement={() => updateQuantity(menuItem.id, quantity + 1)}
                      onDecrement={() => updateQuantity(menuItem.id, quantity - 1)}
                      size="sm"
                    />

                    <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
                      {formatCurrency(itemSubtotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Item Note Input */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
                {isNoteOpen ? (
                  <div className="relative">
                    <NotebookPen className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={item_note || ''}
                      onChange={(e) => updateItemNote(menuItem.id, e.target.value)}
                      placeholder="Add item note (e.g. Extra spicy, no onion)..."
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveNoteInputId(menuItem.id)}
                    className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 hover:text-amber-600 flex items-center space-x-1"
                  >
                    <NotebookPen className="h-3 w-3" />
                    <span>+ Add item note</span>
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Customer Details & Special Instructions Card */}
      <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Guest Information & Notes (Optional)</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-stone-400" />
                <span>Your Name (Optional)</span>
              </label>
              <Input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Mr. Sharma / Room 302"
                className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-stone-400" />
                <span>Phone Number (Optional)</span>
              </label>
              <Input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
              <span>Overall Kitchen / Special Note</span>
            </label>
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="e.g. Please bring extra cutlery, napkins, and serve appetizers first..."
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none h-16"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bill Summary */}
      <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Bill Calculation Summary
        </h3>

        <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex justify-between">
            <span>Items Subtotal ({totalItemsCount} items)</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {formatCurrency(subtotalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-[11px] text-stone-400">
            <span>Server Price Verification</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ Server Recalculated
            </span>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-800 pt-2.5 flex justify-between items-center">
          <div>
            <span className="font-black text-sm text-stone-900 dark:text-stone-100 block">
              Estimated Total Bill
            </span>
            <span className="text-[10px] text-stone-400 font-medium">
              Inclusive of all taxes & charges
            </span>
          </div>

          <span className="text-lg font-black text-amber-600 dark:text-amber-400">
            {formatCurrency(subtotalAmount)}
          </span>
        </div>
      </Card>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 max-w-md mx-auto p-3">
        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-stone-950" />
              <span>Placing Order on Server...</span>
            </>
          ) : (
            <>
              <span>PLACE ORDER NOW</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
