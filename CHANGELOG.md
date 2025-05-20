# Changelog

## May 13 - May 20, 2025

- merge: PR of Sushi
  - docs: api readme
  - feat: dex schemas
  - feat: dex metrics
  - feat: schema resolvers
  - feat: backfill historical data
  - feat: oracle for KDA price
  - feat: processing new payloads
  - feat: added streaming
- fix: missing table migrations for Sushi PR
- fix: missing transaction id when creating event
- fix: missing table associations for Sushi PR
- fix: legibility of env variables
- fix: alias resolution inside container on package.json
- fix: missing dotenv-cli
- feat: sentry plugin to track index usage
- feat: using env array instead of hardcoded items

## May 6 - May 13, 2025

- fix: invalid format of creationtime of coinbase transactions
- fix: missing NFTs on nonFungibleAccount queries
- fix: order index property for events in streaming process
- fix: changed node info validator to accept nullable a node service date
- refactor: removed dead code
- refactor: adjusted file locations/paths
- feat: health route for status 200
- feat: monitoring service with slack integration

## April 22 - May 6, 2025

- docs: comprehensive codebase documentation
- perf: compound cursor for blockFromHeight
- perf: getEventsWithQualifiedName improved for requestKey param
- refactor: improved missing blocks velocity
- refactor: created a separated class to handle query builder of events
- fix: blocks from depth query
- fix: minimumDepth argument in transaction and events queries
- fix: minimumDepth argument in transactions query with query builder approach
- fix: incorrect blocks from depth response
- fix: missing index migrations for transactions and transactionsDetails
- fix: transaction order response when creation time is the same
- fix: missing encoding of cursor ID when length of pagination equals one
- fix: transaction counter for association with a particular block
- fix: cross-chain-transfer field
- fix: fungible accounts returning data for non-existent accounts
- fix: fungible accounts not returning when publicKey=accountName
- fix: removed extra filter for endHeight in the query blocksFromHeight
- fix: removed stack traces from GraphQL
- fix: transfers query using block hash as filter
- fix: blocks from depth subscription
- tests: non-fungible chain account
- tests: non-fungible account
- tests: blocks from height
- tests: blocks from depth
- tests: fungible chain accounts by public key
- tests: fungible accounts by public key
- tests: fungible chain accounts
- tests: fungible chain account
- tests: fungible account
- tests: graph configuration
- tests: network info
- tests: nodes query
- tests: node query
- tests: pact query query
- tests: time report
- tests: transaction query
- tests: block query
- tests: tokens query
- tests: transactions by public key query
- tests: smoke test
- tests: chainweb-node
- tests: coin-circulation
- tests: difficulty
- tests: hashrate
- tests: helpers
- tests: int-uint-64
