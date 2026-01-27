"use client";

import { useState } from "react";
import { HelpCircle, Database, KeyRound, Shield, Link2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { GITHUB_REPO_URL } from "@/lib/config";

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={200}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="How it works"
          aria-expanded={open}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="end" className="w-96 p-0">
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-base leading-tight">
              How Secreteer Works
            </h3>
            <p className="text-xs text-muted-foreground">
              Your secrets are encrypted end-to-end. Here&apos;s what that means:
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-tight">
                  Client-Side Encryption
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your secret is encrypted in your browser using AES-256-GCM
                  before anything leaves your device.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-tight">
                  Key in URL Fragment
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The decryption key is placed in the URL fragment (after the #).
                  Browsers never send this part to servers. Only the recipient
                  with the full link can decrypt.
                </p>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Database className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight">
                    Stored on Server
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Encrypted content, initialization vector (IV), expiry time
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <KeyRound className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight">
                    Never Stored
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Decryption key, your original secret. We cannot read your
                    secrets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Want to verify this yourself? Check out our{" "}
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                GitHub repository
              </a>{" "}
              to see the source code and verify our security claims.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
