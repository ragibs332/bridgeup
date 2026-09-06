# Deployment & Hosting Guide for BRIDGEUP

BridgeUp is a modern Vite + React SPA ready for one-click deployment across all major hosting platforms.

---

## 🚀 1. Deploying to Vercel (Recommended)
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `bridgeup` repository.
4. Set the Build and Output settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. *(Optional)* Add Environment Variable:
   - `VITE_GEMINI_API_KEY`: `AIzaSy...` (Your Google Gemini AI key)
6. Click **Deploy**!

---

## ⚡ 2. Deploying to Netlify
1. Go to [netlify.com](https://netlify.com) and select **"Add new site"** $\rightarrow$ **"Import an existing project"**.
2. Connect your Git repository.
3. Configuration:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add single page app redirect rule (`_redirects` file with `/*  /index.html  200`).
5. Click **Deploy Site**.

---

## 🔥 3. Deploying to Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in and initialize:
   ```bash
   firebase login
   firebase init hosting
   ```
   - **Public directory:** `dist`
   - **Configure as single-page app:** `Yes`
   - **Set up automatic builds:** `No`
3. Build & Deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 🤖 4. Live Google Gemini AI Setup
You can add your Google Gemini API key in two ways:
1. **In the UI:** Open the AI Chatbot in the bottom-left corner $\rightarrow$ click the 🔑 **Key** icon in the header $\rightarrow$ paste your key $\rightarrow$ click **Save Key**.
2. **In Environment Variables:** Create a `.env` file in the root folder:
   ```env
   VITE_GEMINI_API_KEY=AIzaSyYourActualGoogleGeminiKeyHere
   ```
