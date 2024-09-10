import zod from "zod";

const errorSchema = zod.object({
  message: zod.string(),
  type: zod.string(),
});

type PactError = zod.infer<typeof errorSchema>;

export class PactCommandError extends Error {
  public pactError?: PactError;

  public constructor(message: string, pactError?: unknown) {
    super(message);
    const res = errorSchema.safeParse(pactError);
    if (res.success) {
      this.pactError = res.data;
    }
  }
}
