Vercel deployment steps (quick)
=================================

Use these steps to deploy this repository to Vercel securely.

1) Recommended: revoke any API keys you exposed publicly and create new ones.

2) Add environment variables (do NOT commit secret values):

- GROQ_API_KEY — your GROQ API key (required for chat feature)
- DATABASE_URL — production database URL (if you use Prisma in prod)
- NEXTAUTH_URL — https://<your-vercel-app>.vercel.app
- NEXTAUTH_SECRET — a secure random string for NextAuth

3) Dashboard (fastest; recommended):

- Go to https://vercel.com/new
- Click "Import Git Repository" and pick the repo: `BPushpalatha/SIT` (you may need to authorize GitHub)
- Set Framework Preset: Next.js (Vercel auto-detects)
- Add environment variables in the "Environment Variables" section using the keys above
- Click "Deploy"

4) CLI (alternative):

Install the Vercel CLI (run locally):
```bash
npm i -g vercel
```

Login interactively (opens a browser):
```bash
vercel login
```

Link the project (runs in your project folder):
```bash
cd /path/to/repo
vercel link
```

Add environment variables using the CLI (interactive):
```bash
vercel env add GROQ_API_KEY production
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
```

Deploy to production:
```bash
vercel --prod
```

5) Post-deploy checklist

- If your app uses Prisma, run migrations on your production DB (e.g., `prisma migrate deploy`) or configure a Vercel post-deploy hook to run migrations.
- Confirm environment variables are set correctly in Vercel dashboard under Project → Settings → Environment Variables.
- If static assets or image processing fail due to Sharp, ensure the Vercel server has proper settings (Vercel typically provides proper binaries).

Notes
- Do not commit `.env.local` or any secrets to the repo.
- If you want automatic deployments for each push, enable Git Provider integration during import and set the production branch.
