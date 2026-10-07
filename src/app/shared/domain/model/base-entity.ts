/**
 * minimal contract implemented by domain entities across bounded contexts.
 */
export interface BaseEntity {
  /**
   * unique identifier of the entity.
   */
  id: number;
}
