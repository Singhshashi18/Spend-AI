






//receiptScanner.jsx
"use client";
 import { useRef, useEffect } from "react";
  import { Camera, Loader2 } from "lucide-react"; 
  import { Button } from "@/components/ui/button";
   import { toast } from "sonner"; 
   import useFetch from "@/hooks/usefetch"; 
   import { scanReceipt } from "@/action/transaction";
    import axios from "axios"; 
    export function ReceiptScanner({ onScanComplete }) {
       const fileInputRef = useRef(null);
        const {
           loading: scanReceiptLoading, 
           fn: scanReceiptFn,
            data: scannedData, } = useFetch(scanReceipt);
             const handleReceiptScan = async (file) => { 
              if (file.size > 5 * 1024 * 1024)
               { toast.error("File size should be less than 5MB");
                 return; 
                }
                 await scanReceiptFn(file);
                 };
                  useEffect(() => { const processEmbedding = async () => { 
                    if (scannedData && !scanReceiptLoading) { 
                      try { 
                        onScanComplete(scannedData);
                         toast.success("Receipt scanned successfully");
                          // ✅ Send extracted text to /api/generate-embedding for Pinecone storage 
                          //  await axios.post("/api/generate-embedding", 
                          //   {
                          //      id: crypto.randomUUID(), 
                          //      text: scannedData.text, // assuming scannedData contains extracted text 
                          //      // 
                          //      metadata:
                          //      {
                          //        filename: scannedData.filename || "receipt",
                          //         uploadedAt: new Date().toISOString(),
                          //        },
                          //        }); 

                                     await axios.post("/api/generate-embedding", {
  receiptid: crypto.randomUUID(),
  text: scannedData.text,
  category: scannedData.category,
  amount: scannedData.amount,
  date: scannedData.date,
  merchantName: scannedData.merchantName,
  filename: scannedData.filename || "receipt"
});



                                } 
                                catch (error) { 
                                  console.error("Error indexing receipt:", error); 
                                  toast.error("Failed to index receipt in Pinecone");
                                 } 
                                } 
                              }; 
                              processEmbedding(); 
                            },
                             [scanReceiptLoading, scannedData]);
                              return ( <div className="flex items-center gap-4"> 
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
                                     className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500
                                      to-purple-500 animate-gradient hover:opacity-90 transition-opacity
                                       text-white hover:text-white"
                                        onClick={() => fileInputRef.current?.click()} 
                                        disabled={scanReceiptLoading}
                                         > 
                                         {scanReceiptLoading ? (
                                           <>
                                            <Loader2 className="mr-2 animate-spin" />
                                             <span>Scanning Receipt...</span> 
                                             </> 
                                             ) : ( 
                                             <> 
                                             <Camera
                                              className="mr-2"
                                               /> 
                                              <span>Scan Receipt with AI</span> 
                                              </> 
                                            )} 
                                              </Button>
                                               </div> );
                                               }