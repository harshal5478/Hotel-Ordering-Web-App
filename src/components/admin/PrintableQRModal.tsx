'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, Copy, X, Check } from 'lucide-react';
import { Table } from '@/types';
import { getSiteUrl } from '@/lib/env';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PrintableQRModalProps {
  table: Table;
  onClose: () => void;
}

export function PrintableQRModal({ table, onClose }: PrintableQRModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const siteUrl = getSiteUrl();
  const menuUrl = `${siteUrl}/menu?table=${table.qr_token}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      toast.success('Menu URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 80;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 40, 40);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `GrandPalace_Table_${table.table_number}_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success(`Downloaded QR Code PNG for Table ${table.table_number}`);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr-tent-card,
          #printable-qr-tent-card * {
            visibility: visible;
          }
          #printable-qr-tent-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 2rem;
            box-shadow: none;
            border: 2px solid #000;
          }
        }
      `}</style>

      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-400 hover:text-white p-1"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-black text-white">Table QR Tent Card Preview</h3>

        {/* Printable Tent Card Container */}
        <div
          id="printable-qr-tent-card"
          className="bg-white text-stone-950 p-6 rounded-2xl border-4 border-amber-500 shadow-xl text-center space-y-4 font-sans select-none"
        >
          <div className="space-y-1">
            <h1 className="text-xl font-black tracking-widest text-stone-950 uppercase">
              Grand Palace Hotel
            </h1>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Fine Dining & In-Room Service
            </p>
          </div>

          <div className="py-2 bg-stone-950 text-amber-400 rounded-xl font-black text-2xl tracking-wider uppercase">
            TABLE {table.table_number}
          </div>

          <div ref={qrRef} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block mx-auto shadow-inner">
            <QRCodeSVG
              value={menuUrl}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="space-y-0.5">
            <p className="font-extrabold text-sm text-stone-900">
              Scan QR to View Menu & Place Orders
            </p>
            <p className="text-[10px] font-medium text-stone-500">
              Contactless Mobile Ordering System
            </p>
          </div>
        </div>

        {/* Menu URL Copy Bar */}
        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between space-x-2">
          <span className="text-xs font-mono text-amber-400 truncate flex-1">
            {menuUrl}
          </span>
          <button
            onClick={handleCopyUrl}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors shrink-0"
            title="Copy URL"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button
            type="button"
            onClick={handleDownloadPNG}
            variant="outline"
            className="text-xs font-bold border-stone-700 bg-stone-800 hover:bg-stone-700 text-white"
          >
            <Download className="h-4 w-4 mr-1.5" />
            <span>Download PNG</span>
          </Button>

          <Button
            type="button"
            onClick={handlePrint}
            className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            <span>Print QR Card</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
