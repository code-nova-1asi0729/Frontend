import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * incident as it travels through the API. dates use ISO 8601.
 */
export interface IncidentResource extends BaseResource {
  id: number;
  buildingId: number;
  residentId: number;
  equipmentId: number | null;
  category: string;
  description: string;
  status: string;
  ratingScore: number | null;
  ratingComment: string | null;
  reportedAt: string;
  startedAt: string | null;
  resolvedAt: string | null;
  ratedAt: string | null;
}

/**
 * Envelope for incident collections.
 */
export interface IncidentsResponse extends BaseResponse {
  incidents: IncidentResource[];
}
