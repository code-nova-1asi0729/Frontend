import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * sensor reading as it travels through the API.
 */
export interface SensorReadingResource extends BaseResource {
  id: number;
  sensorId: number;
  equipmentId: number;
  metric: string;
  value: number;
  unit: string;
  status: string;
  /** ISO 8601 date and time */
  recordedAt: string;
}

/**
 * Envelope for sensor reading collections.
 */
export interface SensorReadingsResponse extends BaseResponse {
  readings: SensorReadingResource[];
}
