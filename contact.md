# Contact Form — Setup Guide

The contact form on the **Contact** page (`src/pages/Contact.tsx`) sends submissions
straight to your inbox using [Web3Forms](https://web3forms.com) — a free service that
needs **no backend and no database**. Follow the steps below to turn it on.

---

## 1. Get a free access key

1. Go to <https://web3forms.com>.
2. Enter the email address where you want to receive submissions (e.g. `hello@zynocraftx.com`).
3. Check that inbox and copy the **Access Key** they send you (a UUID like
   `a1b2c3d4-1234-5678-9abc-def012345678`).

No account or password is required. The access key is **safe to expose in frontend code** —
it can only deliver messages to the inbox you registered it with.

---

## 2. Add the key to the project

Pick **one** of these:

### Option A — environment variable (recommended)

Create a file named `.env` in the project root:

```bash
VITE_WEB3FORMS_ACCESS_KEY=your-access-key-here
```

`.env` is already git-ignored, so the key won't be committed. Restart the dev server after
adding it (`npm run dev`).

### Option B — paste it directly

Open `src/pages/Contact.tsx` and replace the placeholder:

```ts
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY';
```

Change `'YOUR_WEB3FORMS_ACCESS_KEY'` to your real key.

---

## 3. Test it

1. Run the site:

   ```bash
   npm run dev
   ```

2. Open the **Contact** page, fill in the form, and submit.
3. You should see the **"Project details received."** confirmation, and the submission
   should arrive in your inbox within a minute.

Until a valid key is set, the form still submits but shows an error with an
**"Email us instead"** fallback link.

---

## What gets sent

| Field          | Form input name |
|----------------|-----------------|
| Full name      | `name`          |
| Business email | `email`         |
| Company        | `company`       |
| Project type   | `project_type`  |
| Project details| `message`       |

The email subject is auto-set to `New project enquiry — <project type>`.
A hidden `botcheck` honeypot field silently blocks most spam bots.

---

## Customizing

- **Change the recipient inbox:** generate a new key in the Web3Forms dashboard with a
  different email, then update `VITE_WEB3FORMS_ACCESS_KEY`.
- **Change the fallback email** shown on error: edit the `mailto:hello@zynocraftx.com`
  links in `src/pages/Contact.tsx` (and in `src/components/Footer.tsx`).
- **Add/rename fields:** add an `<input name="...">` inside the `<form>` — Web3Forms
  forwards every named field automatically.

---

## Deployment

Set the same environment variable in your host's dashboard so the production build picks
it up:

- **Netlify:** Site settings → Environment variables → `VITE_WEB3FORMS_ACCESS_KEY`
- **Vercel:** Project → Settings → Environment Variables → `VITE_WEB3FORMS_ACCESS_KEY`

(The site is a static SPA; `public/_redirects` already handles client-side routing on Netlify.)

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Error message on submit | Key missing or wrong — recheck step 2. |
| No email arrives | Check spam folder; confirm the key's registered email is correct. |
| Works in dev, not in production | Env var not set on the host — see **Deployment**. |
| Want submissions in a database too | Switch to a stored backend (Supabase, Firebase) or add Web3Forms webhooks. |
