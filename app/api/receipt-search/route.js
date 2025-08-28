
import { NextResponse } from "next/server";
import { getVectorStore } from "@/lib/langchain";

// Category keywords for fallback
const categoryKeywords = {
  groceries: ["groceries", "food", "supermarket"],
  shopping: ["shopping", "mall", "clothes", "purchase"],
  bills: ["salary", "tax", "insurance", "bills"],
  travel: ["travel", "trip", "flight", "hotel"],
  entertainment: ["movie", "netflix", "concert", "entertainment"]
};

// Expand vague queries
function expandQuery(query) {
  const q = query.toLowerCase();
  if (q === "shopping receipts") return "Show me my shopping receipts from malls or stores";
  if (q === "salary bill") return "Find my salary-related bills including tax and insurance";
  return query;
}

// Infer category from query
function inferCategory(query) {
  const q = query.toLowerCase();
  for (const cat in categoryKeywords) {
    const keywords = categoryKeywords[cat];
    if (keywords.some(k => q.includes(k))) return cat;
  }
  return null;
}

// Assistant-style reply
function getReplyIntro(lang, query, count) {
  if (lang === "hinglish") {
    return `✅ "${query}" ke liye ${count} receipt${count > 1 ? "s" : ""} mil gayi 👇`;
  }
  return `✅ Found ${count} matching receipt${count > 1 ? "s" : ""} for "${query}" 👇`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const query = body.query;
    const lang = body.lang || "english";

    if (!query || query.trim() === "") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const vectorStore = await getVectorStore("__default__");
    const expandedQuery = expandQuery(query);
    const q = expandedQuery.toLowerCase();
    const inferredCategory = inferCategory(q);

    // Semantic search
    const searchResults = await vectorStore.similaritySearchWithScore(expandedQuery, 10);

    // Smart filtering + score boosting
    const filtered = searchResults
      .map(function (pair) {
        const doc = pair[0];
        let score = pair[1];
        const meta = doc.metadata || {};

        const categoryMatch = inferredCategory && meta.category && meta.category.toLowerCase() === inferredCategory;
        const merchantMatch = meta.merchantName && meta.merchantName.toLowerCase().includes(q);
        const amountMatch = meta.amount && q.includes(String(Math.floor(meta.amount)));

        const boost = categoryMatch || merchantMatch || amountMatch ? 0.2 : 0;
        return [doc, score + boost];
      })
      .filter(function (pair) {
        return pair[1] >= 0.55;
      });

    const formatted = filtered.map(function (pair) {
      const doc = pair[0];
      const score = pair[1];
      const meta = doc.metadata || {};

      return {
        text: doc.pageContent || "",
        amount: meta.amount || null,
        category: meta.category || null,
        merchant: meta.merchantName || null,
        date: meta.date || null,
        receiptid: meta.receiptid || null,
        filename: meta.filename || null,
        score: score.toFixed(2)
      };
    });

    const reply = getReplyIntro(lang, query, formatted.length);

    return NextResponse.json({ results: formatted, reply });

  } catch (error) {
    console.error("Error in receipt-search:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
