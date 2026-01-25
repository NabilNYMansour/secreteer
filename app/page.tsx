"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { generateKey, exportKey, encrypt } from "@/lib/crypto";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const EXPIRY_OPTIONS = [
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "360", label: "6 hours" },
  { value: "1440", label: "24 hours" },
  { value: "10080", label: "7 days" },
];

export default function Home() {
  const [secret, setSecret] = useState("");
  const [expiry, setExpiry] = useState("60");
  const [secretUrl, setSecretUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const createSecret = useMutation(api.secrets.create);

  const handleCreate = async () => {
    if (!secret.trim()) {
      toast.error("Please enter a secret to share");
      return;
    }

    setIsCreating(true);

    try {
      const key = await generateKey();
      const keyString = await exportKey(key);
      const { ciphertext, iv } = await encrypt(secret, key);

      const secretId = await createSecret({
        encryptedContent: ciphertext,
        iv,
        expiresInMinutes: parseInt(expiry),
      });

      const url = `${window.location.origin}/s/${secretId}#${keyString}`;
      setSecretUrl(url);
      setSecret("");

      toast.success("Secret created successfully!");
    } catch {
      toast.error("Failed to create secret. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    if (secretUrl) {
      await navigator.clipboard.writeText(secretUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const createAnother = () => {
    setSecretUrl(null);
    setCopied(false);
  };

  return (
    <div className="w-full max-w-2xl">
      {!secretUrl ? (
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Share a Secret</CardTitle>
            <CardDescription>
              Your secret is encrypted in your browser. The decryption key lives
              only in the link&apos;s URL fragment, which is never sent to our servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secret">Secret Message</Label>
              <ScrollArea className="h-[300px]">
                <Textarea
                  id="secret"
                  placeholder="Enter your secret message..."
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="resize-none min-h-[300px]"
                />
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expires after</Label>
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select expiry time" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreate}
              disabled={isCreating || !secret.trim()}
              className="w-full"
            >
              {isCreating ? "Encrypting..." : "Create Secret Link"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Secret Created
            </CardTitle>
            <CardDescription>
              Share this link with the recipient. The secret will expire after
              the set time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Secret Link</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  readOnly
                  value={secretUrl}
                  className="font-mono text-xs sm:text-sm flex-1 min-w-0"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2 sm:mr-0" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2 sm:mr-0" />
                  )}
                  <span className="sm:hidden">{copied ? "Copied!" : "Copy Link"}</span>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-muted text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                This link can only be viewed once. After viewing, the secret
                will be permanently deleted.
              </span>
            </div>

            <Button
              onClick={createAnother}
              variant="outline"
              className="w-full"
            >
              Create Another Secret
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
