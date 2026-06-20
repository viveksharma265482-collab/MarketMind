# MarketMind AI - AI-Powered Marketing Intelligence Platform

MarketMind AI is a full-stack SaaS-style web application designed to help marketers analyze their campaign performance, discover ROI/revenue insights, optimize budgets, minimize wasted ad spend, and receive actionable AI recommendations. 

---

## Key Features

1. **Upload Dataset Section**: Support for CSV and Excel (`.xlsx`) marketing logs, including an automatic column mapping system (reconciles headings like `Sales`, `Ad Spend`, etc., to unified metrics).
2. **Interactive KPI Dashboard**: Focuses on *Total Spend*, *Total Revenue*, *ROI*, *Conversions*, and *Average CPA*, with detailed "What does this mean?" explanations for marketing beginners.
3. **Dynamic Recharts Data Visualizations**:
   - Campaign Performance Over Time (Line trend with interactive metric switcher).
   - Channel Performance allocation (Pie/Bar chart switcher).
4. **Actionable Recommendations Engine**:
   - **Budget Optimization Card**: Shift rules to move funds from low-ROI channels to high-ROI channels.
   - **Wasted Spend Card**: Flags campaigns generating negative returns and estimates budget leakages.
   - **Top Campaigns Card**: Ranks campaigns by ROI metrics.
5. **AI Consultant Mode**: Integrates Gemini API to answer business questions, summarize wins, problems, growth opportunities, and provide campaign coaching tips.
6. **Demo Mode Fallback**: Allows immediate trial with mock campaign data if the backend is offline.

---

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: FastAPI, Pandas, NumPy, openpyxl (Excel parser), Uvicorn
- **AI Model**: Google Gemini API (`gemini-1.5-flash`)

---

## Quick Start Guide

### Prerequisite
Ensure you have **Node.js (v18+)** and **Python (3.10+)** installed on your machine.

---

### Step 1: Set up the Backend (FastAPI)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell/CMD)
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and set your Gemini API Key (optional):
   ```bash
   # Windows
   copy .env.example .env

   # macOS/Linux
   cp .env.example .env
   ```
   Open the `.env` file and replace `your_gemini_api_key_here` with your live Google Gemini key. If left blank, the app will use its built-in rule-based fallback generator.
5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The backend will run at `http://localhost:8000`.*

---

### Step 2: Set up the Frontend (Next.js)

1. Open a new terminal in the project root folder.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   `http://localhost:3000`

---

## Testing the Platform

We have provided a sample marketing dataset in the root folder called `sample_marketing_data.csv`. You can test the platform in two ways:
1. **Direct Upload**: Drag and drop or browse for `sample_marketing_data.csv` in the bottom upload zone, preview the spreadsheet rows, and click **Analyze Data**.
2. **Instant Demo Mode**: Click the link *"...try MarketMind AI instantly with sample campaign data"* at the bottom of the page to run an immediate frontend simulation.
