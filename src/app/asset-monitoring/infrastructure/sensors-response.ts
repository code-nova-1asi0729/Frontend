import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * sensor as it travels through the API.
 */
export interface SensorResource extends BaseResource {
  id: number;
  equipmentId: number | null;
  serialNumber: string;
  model: string;
  status: string;
  /** ISO 8601 date and time, or null if the sensor never sent data */
  lastSeenAt: string | null;
}

/**
 * Envelope for sensor collections.
 */
export interface SensorsResponse extends BaseResponse {
  sensors: SensorResource[];
}
