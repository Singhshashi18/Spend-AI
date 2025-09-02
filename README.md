# 🚀 SpendAI – AI-Powered Finance Management Platform  

![SpendAI Banner](public/landingPage.png)  

> **Manage your expenses smarter with AI!**  
SpendAI is an **AI-powered finance management platform** that helps you **track expenses, scan receipts using AI, and search receipts using Generative AI**.  
Built with **Next.js**, **Supabase**, **LangChain**, **Pinecone**, and **Gemini API**.

---

## 🌟 **Features**
✅ **Finance Management Dashboard**  
- Add expenses manually or by scanning receipts.  
- Real-time expense categorization & summary charts.  
- Secure data storage with Supabase.  

✅ **Smart Receipt Scan (AI-powered OCR)**  
- Upload a receipt → AI extracts amount, date, vendor.  
- Data auto-added to expense tracker (Gemini API + OCR).  

✅ **Smart Receipt Search (Generative AI + RAG)**  
- Search receipts using natural language:  
  *“Show me the coffee receipt from last week”*.  
- Uses **LangChain + Pinecone** for semantic search.  

---

## 🛠 **Tech Stack**
<p align="center">
<img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/LangChain-yellow?style=for-the-badge&logo=chainlink&logoColor=white" />
<img src="https://img.shields.io/badge/Pinecone-0A192F?style=for-the-badge&logo=pinecone&logoColor=white" />
<img src="https://img.shields.io/badge/Gemini%20API-purple?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

---

## 📸 **Screenshots**
| Dashboard | Smart Receipt Scan | AI Receipt Search |
|-----------|--------------------|-------------------|
| ![Dashboard](public/screenshots/dashboard.png) | ![Receipt Scan](public/screenshots/receipt-scan.png) | ![AI Search](public/screenshots/receipt-search-.png) |

---

## ⚡ **Installation**
```bash
# Clone the repo
git clone https://github.com/your-username/spend-ai.git

# Navigate to project
cd spend-ai

# Install dependencies
npm install

# Setup environment variables in .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key

# Run the app
npm run dev

