/**
 * Minimal contract implemented by domain entities across bounded contexts.
 */
export interface BaseEntity {
  /**
   * Unique identifier of the entity.
   */
  id: number;
}
