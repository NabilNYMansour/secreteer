"use client";

import { useEffect, useState, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { importKey, decrypt } from "@/lib/crypto";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Copy, Check, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

type ViewState = "loading" | "confirm" | "viewing" | "burned" | "not_found";

export default function ViewSecretPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [decryptedSecret, setDecryptedSecret] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showSecret, setShowSecret] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState<string>("");

  const secretId = resolvedParams.id as Id<"secrets">;
  const secret = useQuery(api.secrets.get, { id: secretId });
  const burnSecret = useMutation(api.secrets.burn);

  useEffect(() => {
    if (viewState === "viewing" || isDecrypting) {
      return;
    }

    if (secret === undefined) {
      return;
    }

    if (secret === null) {
      setViewState("not_found");
      return;
    }

    const remaining = secret.expiresAt - Date.now();
    if (remaining <= 0) {
      setViewState("not_found");
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      setExpiresIn(`${days} day${days > 1 ? "s" : ""}`);
    } else if (hours > 0) {
      setExpiresIn(`${hours} hour${hours > 1 ? "s" : ""}`);
    } else {
      setExpiresIn(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }

    setViewState("confirm");
  }, [secret, viewState, isDecrypting]);

  const handleReveal = async () => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      toast.error("Missing encryption key in URL");
      return;
    }

    if (!secret) {
      toast.error("Secret not found");
      return;
    }

    setIsDecrypting(true);

    try {
      const key = await importKey(hash);
      const plaintext = await decrypt(secret.encryptedContent, secret.iv, key);
      setDecryptedSecret(plaintext);
      await burnSecret({ id: secretId });
      setViewState("viewing");
      toast.success("Secret decrypted successfully!");
    } catch {
      toast.error(
        "Failed to decrypt secret. The link may be invalid or corrupted."
      );
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyToClipboard = async () => {
    if (decryptedSecret) {
      await navigator.clipboard.writeText(decryptedSecret);
      setCopied(true);
      toast.success("Secret copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {viewState === "loading" && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm">Loading secret...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {viewState === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle>Someone shared a secret with you</CardTitle>
            <CardDescription>
              This secret is encrypted and will be permanently deleted after you
              view it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Expires in {expiresIn}
            </p>

            <div className="flex items-start gap-2 p-3 bg-muted text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Once you reveal this secret, it will be permanently deleted and
                cannot be viewed again.
              </span>
            </div>

            <Button
              onClick={handleReveal}
              disabled={isDecrypting}
              className="w-full"
            >
              {isDecrypting ? (
                "Decrypting..."
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal Secret
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {viewState === "viewing" && decryptedSecret && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Secret Revealed
            </CardTitle>
            <CardDescription>
              This secret has been permanently deleted from our servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <ScrollArea className="h-[300px] bg-muted/50">
                <div className="h-[300px]">
                  <div className="p-3 font-mono text-sm whitespace-pre-wrap break-all min-h-[80px] border">
                    {decryptedSecret}
                  </div>
                </div>
              </ScrollArea>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              This secret has been burned. The link is now invalid.
            </p>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Create Your Own Secret</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {viewState === "burned" && (
        <Card>
          <CardHeader>
            <CardTitle>Secret Burned</CardTitle>
            <CardDescription>
              This secret has already been viewed and permanently deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Create Your Own Secret</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {viewState === "not_found" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Secret Not Found
            </CardTitle>
            <CardDescription>
              This secret doesn&apos;t exist, has already been viewed, or has
              expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Create Your Own Secret</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
