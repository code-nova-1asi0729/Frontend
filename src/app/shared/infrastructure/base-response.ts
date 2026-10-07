/**
 * Base contract for API resources that expose a numeric identifier.
 */
export interface BaseResource {
  /**
   * Unique identifier of the resource.
   */
  id: number;
}

/**
 * Marker interface for response envelopes returned by collection endpoints.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseResponse {}
