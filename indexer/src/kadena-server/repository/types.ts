/**
 * Common type definitions for repository interfaces
 *
 * This file provides shared types used across repository implementations.
 * It defines core interfaces that enable consistent pagination and data
 * structures throughout the application's data access layer.
 */

/**
 * Represents an edge in a paginated connection following the Relay specification
 *
 * This interface implements the edge pattern from the Relay Connection specification,
 * which is used for cursor-based pagination in GraphQL. Each edge contains:
 * - A cursor that uniquely identifies the edge's position in the connection
 * - The actual data node that the edge points to
 *
 * This generic interface allows it to be used with any entity type in the system,
 * providing consistent pagination behavior across all repository implementations.
 *
 * @template T - The type of data node contained in the edge
 */
export interface ConnectionEdge<T> {
  cursor: string;
  node: T;
}
