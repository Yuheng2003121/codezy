"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Logo from "../ui/logo";
import { ArrowRight, Github } from "lucide-react";

const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SigninForm() {
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const redirectTo = searchParams.get("redirectTo") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninFormValues) => {
    setServerError(null);
    setIsLoading(true);

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          // 登录成功后重定向到目标页面
          router.push(redirectTo);
        },
        onError: (ctx) => {
          setServerError(
            ctx.error.message ?? "Sign in failed. Please try again.",
          );
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md px-4">
      {/* Branding */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <Logo />
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Coder CLI</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your AI-powered coding companion
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Server error */}
            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* GitHub Sign In */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isLoading}
              className="w-full"
              onClick={() => {
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: process.env.NEXT_PUBLIC_BASE_URL,
                });
              }}
            >
              <Github className="mr-2 size-4" />
              Continue with GitHub
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign in with email
                </span>
              </div>
            </div>

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full mt-1"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-1 size-4" />
                </>
              )}
            </Button>

            {/* Footer link */}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Decorative terminal hint */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60 font-mono">
        <span className="text-primary/40">$</span>
        <span>coder auth login</span>
      </div>
    </div>
  );
}
