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
import { Terminal, ArrowRight } from "lucide-react"
import Link from "next/link"
import Logo from "./ui/logo"

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null)
    setIsLoading(true)

    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/")
        },
        onError: (ctx) => {
          setServerError(ctx.error.message ?? "Sign up failed. Please try again.")
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <div className="w-full max-w-md px-4">
      {/* Branding */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <Logo/>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Coder CLI</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your account to get started
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Set up your profile to start coding with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Server error */}
            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Name */}
            <Field data-invalid={!!errors.name || undefined}>
              <FieldLabel htmlFor="signup-name">Name</FieldLabel>
              <Input
                id="signup-name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <FieldError>{errors.name.message}</FieldError>
              )}
            </Field>

            {/* Email */}
            <Field data-invalid={!!errors.email || undefined}>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <FieldError>{errors.email.message}</FieldError>
              )}
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors.password || undefined}>
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            {/* Confirm Password */}
            <Field data-invalid={!!errors.confirmPassword || undefined}>
              <FieldLabel htmlFor="signup-confirm-password">Confirm Password</FieldLabel>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
            </Field>

            {/* Submit */}
            <Button type="submit" size="lg" disabled={isLoading} className="w-full mt-1">
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-1 size-4" />
                </>
              )}
            </Button>

            {/* Footer link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Decorative terminal hint */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60 font-mono">
        <span className="text-primary/40">$</span>
        <span>coder auth register</span>
      </div>
    </div>
  )
}
