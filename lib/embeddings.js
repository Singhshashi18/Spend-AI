
import 'dotenv/config'
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "./langchain.js";

export const storeReceiptEmbedding = async (receipt) => {
  try {
    const { receiptid, text, category,amount,date,filename ,merchantName} = receipt;

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", 
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const index = await getPineconeIndex();

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: "receipts"
    });

    await vectorStore.addDocuments([
      
      {
      pageContent: text,
      metadata: {
        receiptid,
        category: category ?? null,
        amount: amount ? parseFloat(amount) : null,
        date: date ?? null,
         merchantName: merchantName ?? null,
        filename: filename ?? null
      }
    }
    ]);

    console.log("✅ Receipt embedding stored in Pinecone");
  } catch (error) {
    console.error("❌ Error storing receipt embedding:", error);
  }
};


