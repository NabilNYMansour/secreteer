import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Create a new secret
export const create = mutation({
  args: {
    encryptedContent: v.string(),
    iv: v.string(),
    expiresInMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    const expiresAt = Date.now() + args.expiresInMinutes * 60 * 1000;

    // Insert the secret
    const secretId = await ctx.db.insert("secrets", {
      encryptedContent: args.encryptedContent,
      iv: args.iv,
      expiresAt,
    });

    // Schedule deletion
    await ctx.scheduler.runAt(
      new Date(expiresAt),
      internal.secrets.deleteExpiredSecret,
      { secretId }
    );

    return secretId;
  },
});

// Get a secret by ID
export const get = query({
  args: {
    id: v.id("secrets"),
  },
  handler: async (ctx, args) => {
    const secret = await ctx.db.get(args.id);

    if (!secret) {
      return null;
    }

    // Check if expired
    if (secret.expiresAt < Date.now()) {
      return null;
    }

    return {
      encryptedContent: secret.encryptedContent,
      iv: secret.iv,
      expiresAt: secret.expiresAt,
    };
  },
});

// Delete a secret (for one-time view or manual deletion)
export const burn = mutation({
  args: {
    id: v.id("secrets"),
  },
  handler: async (ctx, args) => {
    const secret = await ctx.db.get(args.id);
    if (secret) {
      await ctx.db.delete(args.id);
      return true;
    }
    return false;
  },
});

// Internal function to delete expired secrets (called by scheduler)
export const deleteExpiredSecret = internalMutation({
  args: {
    secretId: v.id("secrets"),
  },
  handler: async (ctx, args) => {
    const secret = await ctx.db.get(args.secretId);
    if (secret) {
      await ctx.db.delete(args.secretId);
    }
  },
});
