# Production Deployment Guide

## Overview
This guide covers deploying the **Hotel QR Food Ordering System** to **Vercel** and **Supabase**.

---

## 1. Prerequisites
- GitHub/GitLab repository with project code.
- Vercel Account ([vercel.com](https://vercel.com)).
- Supabase Account ([supabase.com](https://supabase.com)).

---

## 2. Supabase Setup
1. Create a Supabase Project.
2. Run database schema scripts in SQL Editor:
   - `supabase/schema.sql`
   - `supabase/migrations/*`
3. Confirm `menu-images` Storage bucket exists with public read access and 5MB limit.

---

## 3. Vercel Configuration
1. Import repository in Vercel.
2. Set Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://ubdclczdxfonwrprpzyg.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-hotel-domain.com`
3. Deploy! Vercel builds the Next.js App Router application automatically.
