
import { NextResponse } from "next/server";
import { storeReceiptEmbedding } from "@/lib/embeddings";

export async function POST(req) {
  try {
    const body = await req.json();
    const {  receiptid, text, category,amount,date,filename } = body;

    await storeReceiptEmbedding({ receiptid, text, category,amount,date,filename});

    return NextResponse.json({ message: "Embedding stored successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to store embedding" }, { status: 500 });
  }
}
