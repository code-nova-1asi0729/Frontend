import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * building as it travels through the API.
 */
export interface BuildingResource extends BaseResource {
  id: number;
  name: string;
  code: string;
  address: string;
  district: string;
  totalUnits: number;
  status: string;
}

/**
 * Envelope for building collections.
 */
export interface BuildingsResponse extends BaseResponse {
  buildings: BuildingResource[];
}
