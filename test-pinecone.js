import 'dotenv/config';
import { getPineconeIndex } from "./lib/langchain.js";

(async () => {
  try {
    const index = await getPineconeIndex();
    console.log("✅ Connected to Pinecone index successfully");
  } catch (err) {
    console.error("❌ Pinecone connection failed:", err);
  }
})();
