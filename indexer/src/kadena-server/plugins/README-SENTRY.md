# Sentry Integration

This project has been integrated with Sentry for error tracking and monitoring. Sentry captures and reports errors from GraphQL operations, providing detailed context to help with debugging.

## Setup

To enable Sentry in your environment, you need to set the following environment variables:

1. `SENTRY_DSN` - Your Sentry project DSN (required to enable Sentry)
2. `RELEASE_VERSION` - The version/commit of your application (optional but recommended)

You can add these to your environment or .env file:

```
SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/project-id
RELEASE_VERSION=v1.0.0 # or your git commit hash
```

## How It Works

The Sentry integration is implemented as an Apollo Server plugin that:

1. Initializes Sentry with your DSN and environment settings
2. Captures GraphQL errors when they occur
3. Adds context to errors including:
   - Operation type and name
   - GraphQL query and variables
   - User information (if available)
   - Error path (field path where the error occurred)

## Error Filtering

The plugin automatically filters out expected errors like:

- Authentication errors (containing "Not authenticated")
- Validation errors (with code "BAD_USER_INPUT")

This ensures only unexpected errors are reported to Sentry.

## Modifying the Integration

If you need to modify the Sentry integration, you can edit the plugin at:
`indexer-kadena/indexer/src/plugins/sentry-plugin.ts`

For example, you may want to:

- Adjust error filtering logic
- Add additional context data
- Change transaction sampling rates

## Getting a Sentry DSN

If you don't have a Sentry DSN:

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new project
3. Choose Node.js as the platform
4. Copy the DSN provided in the setup instructions

## Further Reading

For more information on Sentry and Apollo integration, see:

- [Sentry Node.js docs](https://docs.sentry.io/platforms/node/)
- [Apollo Server plugin documentation](https://www.apollographql.com/docs/apollo-server/integrations/plugins/)
