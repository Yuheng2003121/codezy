"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import Logo from "./ui/logo"
import { ArrowRight } from "lucide-react"

const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SigninFormValues = z.infer<typeof signinSchema>

export default function SigninForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SigninFormValues) => {
    setServerError(null)
    setIsLoading(true)

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/")
        },
        onError: (ctx) => {
          setServerError(ctx.error.message ?? "Sign in failed. Please try again.")
          setIsLoading(false)
        },
      }
    )
  }

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

            {/* Email */}
            <Field data-invalid={!!errors.email || undefined}>
              <FieldLabel htmlFor="signin-email">Email</FieldLabel>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors.password || undefined}>
              <FieldLabel htmlFor="signin-password">Password</FieldLabel>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

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
