import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * critical equipment as it travels through the API.
 */
export interface EquipmentResource extends BaseResource {
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
 * Envelope for equipment collections.
 */
export interface EquipmentResponse extends BaseResponse {
  equipment: EquipmentResource[];
}
