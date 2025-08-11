

"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/usefetch";
import { scanReceipt } from "@/action/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    await scanReceiptFn(file);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully");
    }
  }, [scanReceiptLoading, scannedData, onScanComplete]);

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-lg border border-gray-700 animate-fadeIn">
      <p className="text-sm text-gray-400 flex items-center gap-1">
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        AI-powered receipt scanning
      </p>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />

      <Button
        type="button"
        variant="outline"
        className="relative w-full h-12 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-semibold tracking-wide shadow-lg hover:shadow-pink-500/50 
        transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity"></span>
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2 group-hover:animate-bounce" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500">
        Upload or click a photo of your receipt to auto-extract details.
      </p>
    </div>
  );
}
