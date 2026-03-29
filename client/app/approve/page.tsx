"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Key,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "denied";

export default function DeviceApprovalPage() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userCode = searchParams.get("user_code");

  const [isProcessing, setIsProcessing] = useState({
    approve: false,
    deny: false,
  });

  const [status, setStatus] = useState<Status>("pending");

  useEffect(() => {
    if (!isPending && !data?.session) {
      router.push("/sign-in");
    }
  }, [data, isPending, router]);

  if (isPending || !data?.session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleApprove = async () => {
    setIsProcessing((prev) => ({ ...prev, approve: true }));

    try {
      const response = await authClient.device.approve({
        userCode: userCode || "",
      });

      if (response.error) {
        throw new Error(response.error.error_description || "Approval failed");
      }

      setStatus("approved");
      toast.success("Device approved successfully!");

      // 成功后延迟跳转，让用户看一眼状态变化
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing((prev) => ({ ...prev, approve: false }));
    }
  };

  const handleDeny = async () => {
    setIsProcessing((prev) => ({ ...prev, deny: true }));

    try {
      const response = await authClient.device.deny({
        userCode: userCode || "",
      });

      if (response.error) {
        throw new Error(response.error.error_description || "Deny failed");
      }

      setStatus("denied");
      toast.info("Device access denied");

      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing((prev) => ({ ...prev, deny: false }));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground mb-4 mx-auto">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Device Approval</h1>
          <p className="text-muted-foreground">
            Review and approve device access to your account
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Key className="w-5 h-5 text-primary" />
              Device Authorization Request
            </CardTitle>
            <CardDescription>
              A device is requesting access to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">User Code</span>
                <Badge
                  variant="outline"
                  className="font-mono text-base px-3 py-1"
                >
                  {userCode || "N/A"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account</span>
                <span className="text-sm font-medium">
                  {data?.user?.email || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "text-sm flex items-center gap-1.5 font-medium transition-colors duration-300",
                    status === "pending" &&
                      "text-amber-600 dark:text-amber-400",
                    status === "approved" &&
                      "text-green-600 dark:text-green-400",
                    status === "denied" && "text-red-600 dark:text-red-400",
                  )}
                >
                  {isProcessing.approve || isProcessing.deny ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {status === "pending" && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      {status === "approved" && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {status === "denied" && (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={handleDeny}
                disabled={
                  isProcessing.deny ||
                  isProcessing.approve ||
                  status !== "pending"
                }
              >
                {isProcessing.deny ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Deny"
                )}
              </Button>
              <Button
                className="flex-1 h-12 bg-primary hover:bg-primary/90"
                onClick={handleApprove}
                disabled={
                  isProcessing.approve ||
                  isProcessing.deny ||
                  status !== "pending"
                }
              >
                {isProcessing.approve ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Approve"
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Secure OAuth 2.0 Device Flow</span>
                <Badge variant="outline" className="font-mono">
                  CLI v1.0
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Only approve devices you trust
        </p>
      </div>
    </div>
  );
}
