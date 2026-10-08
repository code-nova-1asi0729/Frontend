import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * alert as it travels through the API.
 */
export interface AlertResource extends BaseResource {
  id: number;
  equipmentId: number;
  metric: string;
  severity: string;
  status: string;
  lastValue: number;
  /** ISO 8601 date and time */
  detectedAt: string;
}

/**
 * Envelope for alert collections.
 */
export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}
