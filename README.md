# Zyoin Recruitment Dashboard — with Groq AI Chatbot

An AI-powered recruitment pipeline dashboard for Zyoin.
Built with vanilla HTML/CSS/JS + a Vercel serverless proxy for the Groq API.

---

## Project Structure

```
zyoin-dashboard/
├── public/
│   └── index.html        ← Dashboard + chatbot UI
├── api/
│   └── chat.js           ← Vercel serverless function (Groq proxy)
├── vercel.json           ← Vercel routing config
├── package.json
├── .env.example
└── README.md
```

---

## Step 1 — Get a Free Groq API Key

1. Go to https://console.groq.com
2. Sign up (no credit card needed)
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)

---

## Step 2 — Deploy to Vercel (Recommended — Free)

### Option A: Vercel CLI (fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Inside the project folder
cd zyoin-dashboard
vercel

# Follow the prompts — when asked about framework, select "Other"
# When asked about build settings, press Enter for defaults
```

Then add your environment variable:
```bash
vercel env add GROQ_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development

# Redeploy to apply the env var
vercel --prod
```

### Option B: Vercel Dashboard (no CLI)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → **Add New Project**
3. Import your GitHub repo
4. In **Environment Variables**, add:
   - Name: `GROQ_API_KEY`
   - Value: `gsk_your_key_here`
5. Click **Deploy**

Your dashboard will be live at `https://your-project.vercel.app`

---

## Step 3 — Run Locally (optional)

```bash
# Run local dev server (simulates Vercel serverless functions)
cd zyoin-dashboard
vercel dev
```

Open http://localhost:3000

For local dev, create a `.env.local` file:
```
GROQ_API_KEY=gsk_your_key_here
```

Note: `.env.local` is ignored by git (see `.gitignore`) — don’t commit API keys.

If you don't want to install the Vercel CLI globally, you can also run:
```bash
cd zyoin-dashboard
npx vercel dev
```

---

## How It Works

```
Browser (index.html)
    │
    │  POST /api/chat  { messages, system }
    ▼
Vercel Serverless Function (api/chat.js)
    │  ← GROQ_API_KEY injected from env (never exposed to browser)
    │  POST https://api.groq.com/openai/v1/chat/completions
    ▼
Groq API  (model: llama-3.3-70b-versatile)
    │
    │  { reply: "..." }
    ▼
Browser — displays in chat panel
```

The API key is **never sent to the browser**. It stays securely in Vercel's environment.

---

## Groq Free Tier Limits

| Model | Requests/min | Tokens/min | Tokens/day |
|-------|-------------|-----------|-----------|
| llama-3.3-70b-versatile | 30 | 6,000 | 100,000 |

More than enough for an internal recruitment dashboard.

---

## Customising the Data

Edit the `DATA` and `RECRUITERS` objects in `public/index.html` to replace
the sample figures with your real pipeline data.
