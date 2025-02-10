import zod from "zod";
import { getRequiredEnvString } from "../utils/helpers";

const KADENA_GRAPHQL_URL = getRequiredEnvString("KADENA_GRAPHQL_API_URL");
const KADENA_GRAPHQL_PORT = getRequiredEnvString("KADENA_GRAPHQL_API_PORT");

export const dispatchInfoSchema = zod.object({
  hash: zod.string(),
  chainId: zod.string(),
  height: zod.number(),
  requestKeys: zod.array(zod.string()),
  qualifiedEventNames: zod.array(zod.string()),
});

export type DispatchInfo = zod.infer<typeof dispatchInfoSchema>;

export const dispatch = async (dispatchInfo: DispatchInfo) => {
  try {
    const url = `${KADENA_GRAPHQL_URL}:${KADENA_GRAPHQL_PORT}/new-block`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dispatchInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }
    return true;
  } catch (err: unknown) {
    const errorData = err instanceof Error ? err.message : "Unknown error";
    console.error("Dispatcher error:", errorData);
    return false;
  }
};
