# Render Web Service Deployment Guide

## Overview
This document provides step-by-step instructions for deploying the **Hotel QR Food Ordering System** on **Render** as a standard **Next.js Web Service**, using Supabase for database, authentication, storage, and realtime events.

---

## 1. Render Web Service Deployment Steps

### Step A: Connect GitHub Repository
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `https://github.com/harshal5478/Hotel-Ordering-Web-App`.

### Step B: Configure Service Parameters
- **Name**: `hotel-qr-ordering`
- **Environment**: `Node`
- **Region**: Choose closest to hotel location (e.g. Singapore / Frankfurt / Oregon)
- **Branch**: `main`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

---

## 2. Render Environment Variables Setup

Configure the following environment variables in your Render Web Service settings (**Environment** tab):

| Key | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ubdclczdxfonwrprpzyg.supabase.co` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_pSEuJN2GcM8WZzsGWQoOEA_vaCMz6qV...` | Supabase Anon Client Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | Server-Only Secret Key |
| `NEXT_PUBLIC_SITE_URL` | `https://hotel-qr-ordering.onrender.com` | Live Production URL for QR Codes |
| `NODE_VERSION` | `20.18.0` | Node.js Runtime Version |

> [!NOTE]
> Render automatically injects the `PORT` environment variable. Next.js (`npm run start`) dynamically listens on Render's assigned port.

---

## 3. Using Render Blueprints (`render.yaml`)

Alternatively, deploy using Render Infrastructure-as-Code Blueprint:
1. Ensure [`render.yaml`](file:///d:/kulswamiini/render.yaml) is present in your repo root.
2. In Render Dashboard, select **New +** -> **Blueprint**.
3. Select your repository. Render will automatically detect build/start commands and prompt for environment variables.

---

## 4. Post-Deployment Verification
1. Open your live Render Web Service URL (e.g. `https://hotel-qr-ordering.onrender.com`).
2. Log in at `/admin/login`.
3. Go to `/admin/tables` and click **Print QR** or **Copy URL**.
4. Confirm that generated QR codes use `https://hotel-qr-ordering.onrender.com/menu?table=<qr_token>` (no localhost URLs).
