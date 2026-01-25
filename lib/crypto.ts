// Client-side encryption using Web Crypto API

// Generate a random encryption key
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

// Export key to base64url string (for URL)
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64Url(exported);
}

// Import key from base64url string
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyBuffer = base64UrlToArrayBuffer(keyString);
  return await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["decrypt"]
  );
}

// Encrypt a string
export async function encrypt(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  return {
    ciphertext: arrayBufferToBase64Url(encrypted),
    iv: arrayBufferToBase64Url(iv.buffer as ArrayBuffer),
  };
}

// Decrypt a string
export async function decrypt(
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const ciphertextBuffer = base64UrlToArrayBuffer(ciphertext);
  const ivBuffer = base64UrlToArrayBuffer(iv);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    key,
    ciphertextBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Helper functions for base64url encoding/decoding
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
  // Add padding if needed
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
