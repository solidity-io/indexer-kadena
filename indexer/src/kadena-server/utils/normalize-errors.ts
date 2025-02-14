import { GraphQLFormattedError } from 'graphql';
import { ZodError } from 'zod';
import { unwrapResolverError } from '@apollo/server/errors';

interface CustomFormattedError extends GraphQLFormattedError {
  type?: string;
  description?: string;
  data?: any;
}

export const formatError = (
  formattedError: GraphQLFormattedError,
  error: unknown,
): CustomFormattedError => {
  const unwrappedError = unwrapResolverError(error);

  if (unwrappedError instanceof ZodError) {
    if (unwrappedError.issues.length > 0) {
      return {
        message: 'Input Validation Error',
        type: 'ZodError',
        description: 'The input provided is invalid. Check the input and try again.',
        data: unwrappedError.issues.map(issue => ({
          message: issue.message,
          path: issue.path.join('.'),
        })),
      };
    }
  }

  if (
    error instanceof Error &&
    'code' in error &&
    'type' in error &&
    (error as any).code === 'ECONNREFUSED'
  ) {
    return {
      message: 'Chainweb Node Connection Refused',
      type: (error as any).type,
      description:
        'Chainweb Node connection refused. Are you sure the Chainweb Node is running and reachable?',
      data: error.stack ?? [],
    };
  }

  return formattedError;
};
