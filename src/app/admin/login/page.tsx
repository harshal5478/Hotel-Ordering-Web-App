'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hotel, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoginSchema, LoginFormInput } from '@/lib/validations';
import { loginAction } from '@/actions/auth';
import { toast } from 'sonner';

function AdminLoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormInput) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginAction(data);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed');
        toast.error(res.error || 'Authentication failed');
      } else {
        toast.success('Successfully logged in!');
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setErrorMessage('An unexpected error occurred during login');
      toast.error('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent className="space-y-4 pt-2">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300">Staff Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
            <Input
              {...register('email')}
              type="email"
              placeholder="staff@grandpalace.com"
              className="pl-9 bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-500"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-400 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
            <Input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="pl-9 bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-500"
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-400 font-medium">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 text-sm font-bold flex items-center justify-center space-x-2 mt-2 bg-amber-500 text-stone-950 hover:bg-amber-400"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-[11px] text-center text-stone-500 pt-2">
        Single-Hotel Staff Portal &bull; Supabase Auth Protected
      </p>
    </CardContent>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md bg-stone-900 border-stone-800 text-stone-100 p-2 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Hotel className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Staff Login</CardTitle>
          <CardDescription className="text-stone-400 text-xs">
            Sign in with your hotel staff credentials to manage menu & orders
          </CardDescription>
        </CardHeader>

        <Suspense fallback={<div className="p-6 text-center text-stone-400 text-xs">Loading form...</div>}>
          <AdminLoginFormContent />
        </Suspense>
      </Card>
    </div>
  );
}
