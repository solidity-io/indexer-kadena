import zod from 'zod';

const errorSchema = zod.object({
  message: zod.string(),
  type: zod.string(),
});

type GasError = zod.infer<typeof errorSchema>;

export class GasLimitEstimationError extends Error {
  public originalError?: GasError;

  public constructor(message: string, originalError?: unknown) {
    super(message);
    const res = errorSchema.safeParse(originalError);
    if (res.success) {
      this.originalError = res.data;
    }
  }
}
