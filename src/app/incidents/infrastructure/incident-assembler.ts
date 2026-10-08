import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Incident } from '../domain/model/incident.entity';
import { IncidentCategory } from '../domain/model/incident-category';
import { IncidentStatus } from '../domain/model/incident-status';
import { IncidentResource, IncidentsResponse } from './incidents-response';

const toDate = (value: string | null): Date | null => (value ? new Date(value) : null);
const toText = (value: Date | null): string | null => (value ? value.toISOString() : null);

/**
 * maps incidents between the API and the domain model.
 */
export class IncidentAssembler implements BaseAssembler<
  Incident,
  IncidentResource,
  IncidentsResponse
> {
  toEntityFromResource(resource: IncidentResource): Incident {
    return new Incident({
      ...resource,
      category: resource.category as IncidentCategory,
      status: resource.status as IncidentStatus,
      reportedAt: new Date(resource.reportedAt),
      startedAt: toDate(resource.startedAt),
      resolvedAt: toDate(resource.resolvedAt),
      ratedAt: toDate(resource.ratedAt),
    });
  }

  toResourceFromEntity(entity: Incident): IncidentResource {
    return {
      id: entity.id,
      buildingId: entity.buildingId,
      residentId: entity.residentId,
      equipmentId: entity.equipmentId,
      category: entity.category,
      description: entity.description,
      status: entity.status,
      ratingScore: entity.ratingScore,
      ratingComment: entity.ratingComment,
      reportedAt: entity.reportedAt.toISOString(),
      startedAt: toText(entity.startedAt),
      resolvedAt: toText(entity.resolvedAt),
      ratedAt: toText(entity.ratedAt),
    };
  }

  toEntitiesFromResponse(response: IncidentsResponse): Incident[] {
    return response.incidents.map((resource) => this.toEntityFromResource(resource));
  }
}
