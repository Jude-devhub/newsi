# 📰 Newsi

**Newsi** is a modern news website built with **Next.js 13 App Router**.  
It delivers **credible, real-time news** to readers by integrating with the [NewsAPI](https://newsapi.org/).  

The site is organized into sections like **finance, entertainment, local, sports, tech, and world** for a smooth browsing experience.  
It also detects the visitor’s **country** (using [ipapi](https://ipapi.co/)) and serves region-specific news when possible.

---

## 🚀 Features

- 🌍 **Country detection** with IP lookup (via `getUserCountry.ts`)
- 📰 Fetches live articles from **NewsAPI**
- 🖼️ **Fallback images** for missing thumbnails
- 📱 **Responsive design** (mobile-first with Tailwind CSS)
- ⚡ Server-side rendering with **Next.js App Router**
- 📂 Organized news sections: *finance, entertainment, local, search, sports, tech, world*

---

## 🛠️ Tech Stack

- [Next.js 13](https://nextjs.org/) – React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [NewsAPI](https://newsapi.org/) – News source
- [ipapi](https://ipapi.co/) – IP-based country detection

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/newsi.git
cd newsi
Install dependencies:

bash
Copy code
npm install
# or
yarn install
🔑 Environment Variables
Create a .env.local file in the root directory and add:

env
Copy code
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key_here
You can get your API key from https://newsapi.org.

▶️ Running the Project
Start the development server:

bash
Copy code
npm run dev
Visit: http://localhost:3000

Build for production:

bash
Copy code
npm run build
npm start
📂 Project Structure
bash
Copy code
newsi/
├── app/                  
│   ├── finance/           # Finance news section
│   │   └── page.tsx
│   ├── entertainment/     # Entertainment news section
│   ├── local/             # Local news section
│   ├── sports/            # Sports news section
│   ├── tech/              # Tech news section
│   ├── world/             # World news section
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Homepage
│
├── components/            # UI components (e.g. NewsLayout, cards)
├── lib/                   # Utility functions
│   ├── fetchNews.ts       # Fetch articles from NewsAPI
│   └── getUserCountry.ts  # Detect visitor’s country
│
├── public/                # Static assets
├── .env.local             # Environment variables (ignored in git)
└── README.md              # Documentation
📝 Usage Guide
1. Adding a New Section (e.g., business)
Inside the app/ folder, create a new directory:

bash
Copy code
app/business/page.tsx
Add the following code:

tsx
Copy code
// app/business/page.tsx
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";
import { getUserCountry } from "@/lib/getUserCountry";

export default async function BusinessPage() {
  const country = await getUserCountry();
  const articles = await fetchNews(country || "Nigeria", "business");
  return <NewsLayout articles={articles} />;
}
Here, "business" is the category for NewsAPI.

Restart the dev server and visit:

bash
Copy code
http://localhost:3000/business
2. Extending fetchNews.ts
Make sure fetchNews supports both country and category. Example:

ts
Copy code
// lib/fetchNews.ts
export async function fetchNews(country: string, category?: string) {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const url = new URL("https://newsapi.org/v2/top-headlines");

  url.searchParams.set("country", country.toLowerCase().slice(0, 2)); // e.g. NG
  if (category) url.searchParams.set("category", category);
  url.searchParams.set("apiKey", apiKey || "");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`NewsAPI failed: ${res.status}`);
  const data = await res.json();

  return data.articles || [];
}
3. Adding Navigation
Update your header/navigation component (e.g., in components/layout) to link the new section:

tsx
Copy code
<nav>
  <a href="/finance">Finance</a>
  <a href="/tech">Tech</a>
  <a href="/world">World</a>
  <a href="/business">Business</a> {/* New */}
</nav>
🌐 Deployment
You can deploy Newsi easily with Vercel (recommended for Next.js):

Push your repo to GitHub.

Import the repo into Vercel.

Add your NEXT_PUBLIC_NEWS_API_KEY in Vercel Environment Variables.

Deploy 🎉

📜 License
This project is licensed under the MIT License.
Feel free to use and adapt it for your own projects.

💡 Newsi is designed to keep readers informed with fast, credible, and localized news.

yaml
Copy code

---

👉 Do you want me to also include a **screenshot/preview section** in the README (so your GitHub rep