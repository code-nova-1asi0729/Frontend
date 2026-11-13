import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * device as it travels through the API.
 */
export interface DeviceResource extends BaseResource {
  id: number;
  buildingId: number;
  code: string;
  name: string;
  type: string;
  location: string;
  /** date as text with the format yyyy-MM-dd */
  installationDate: string;
  status: string;
}

/**
 * Envelope for device collections.
 */
export interface DevicesResponse extends BaseResponse {
  devices: DeviceResource[];
}
