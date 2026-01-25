import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  secrets: defineTable({
    encryptedContent: v.string(),
    iv: v.string(), // Initialization vector for AES encryption
    expiresAt: v.number(), // Unix timestamp
  }).index("by_expiry", ["expiresAt"]),
});
