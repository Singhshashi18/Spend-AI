
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeStore } from "@langchain/pinecone";

/**
 * --- Pinecone client & index ---
 */
let _pinecone;
export function getPinecone() {
  if (_pinecone) return _pinecone;
  _pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  return _pinecone;
}

export async function getPineconeIndex() {
  const pc = getPinecone();
  const indexName = process.env.PINECONE_INDEX_NAME;
  console.log("🔍 Using Pinecone index:", indexName);
  // ensure index exists (create once manually in dashboard if needed)
  return pc.index(indexName);
}

/**
 * --- Embeddings & LLM (Gemini) ---
 * Uses Google Generative AI (Gemini) via LangChain
 */
export function getEmbeddings() {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004", // Google embeddings model
  });
}

export function getLLM() {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-pro",     // or "gemini-1.5-flash" for cheaper/faster
    temperature: 0.2,
  });
}

/**
 * --- Vector store helpers ---
 * Namespace = userId to isolate each user's data
 */
export async function getVectorStore(userId) {
  const index = await getPineconeIndex();
  const embeddings = getEmbeddings();
  return await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: String(userId),
    textKey: "text", // we’ll store a `text` field in metadata/docs
  });
}

/**
 * Utility to build a concise context string from retrieved docs
 */
export function buildContextFromDocs(docs = []) {
  return docs
    .map((d, i) => {
      const m = d.metadata || {};
      // expect: merchant, items, total, date in metadata
      return `${i + 1}. ${m.merchant ?? ""} | ₹${m.total ?? "?"} | ${m.date ?? ""} | items: ${
        Array.isArray(m.items) ? m.items.join(", ") : m.items ?? ""
      }`;
    })
    .join("\n");
}
