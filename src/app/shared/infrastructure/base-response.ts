/**
 * base contract for api resources that expose a numeric identifier.
 */
export interface BaseResource {
  /**
   * unique identifier of the resource.
   */
  id: number;
}

/**
 * marker interface for response envelopes returned by collection endpoints.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseResponse {}
