import { getRequiredEnvString } from "../../../../utils/helpers";
import { ResolverContext } from "../../../config/apollo-server-config";
import { BlockResolvers } from "../../../config/graphql-types";
import crypto from "crypto";

const SYNC_BASE_URL = getRequiredEnvString("SYNC_BASE_URL");
const NETWORK_ID = getRequiredEnvString("SYNC_NETWORK");

function base64UrlToBase64(base64url: any) {
  // Convert Base64 URL format to standard Base64
  return (
    base64url.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (base64url.length % 4)) % 4)
  );
}

async function hashWithBlake2s(input: any) {
  const normalizedBase64 = base64UrlToBase64(input);
  const buffer = Buffer.from(normalizedBase64, "base64");
  const truncatedBuffer = buffer.subarray(0, -32);
  const hash = crypto.createHash("blake2s256").update(truncatedBuffer).digest();
  return Buffer.from(hash).reverse().toString("hex");
}

export const powHashBlockResolver: BlockResolvers<ResolverContext>["powHash"] =
  async (parent) => {
    console.log("powHashBlockResolver");

    const url = `${SYNC_BASE_URL}/${NETWORK_ID}/chain/${parent.chainId}/header/${parent.hash}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const output = await res.json();
    return hashWithBlake2s(output);
  };
