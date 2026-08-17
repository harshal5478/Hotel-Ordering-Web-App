'use me'; // Server action directive below
'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginSchema, LoginFormInput } from '@/lib/validations';
import { redirect } from 'next/navigation';

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function loginAction(
  data: LoginFormInput
): Promise<AuthActionResult> {
  // 1. Validate inputs with Zod
  const validation = LoginSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid login details',
    };
  }

  const { email, password } = validation.data;

  // 2. Sign in with Supabase Auth
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message || 'Failed to authenticate staff user',
    };
  }

  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    redirect('/admin/login');
  }
  return user;
}
