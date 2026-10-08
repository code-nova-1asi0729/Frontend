import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Alert } from '../domain/model/alert.entity';
import { AlertSeverity } from '../domain/model/alert-severity';
import { AlertStatus } from '../domain/model/alert-status';
import { AlertResource, AlertsResponse } from './alerts-response';

/**
 * maps alerts between the API and the domain model.
 */
export class AlertAssembler implements BaseAssembler<Alert, AlertResource, AlertsResponse> {
  toEntityFromResource(resource: AlertResource): Alert {
    return new Alert({
      ...resource,
      severity: resource.severity as AlertSeverity,
      status: resource.status as AlertStatus,
      detectedAt: new Date(resource.detectedAt),
    });
  }

  toResourceFromEntity(entity: Alert): AlertResource {
    return {
      id: entity.id,
      equipmentId: entity.equipmentId,
      metric: entity.metric,
      severity: entity.severity,
      status: entity.status,
      lastValue: entity.lastValue,
      detectedAt: entity.detectedAt.toISOString(),
    };
  }

  toEntitiesFromResponse(response: AlertsResponse): Alert[] {
    return response.alerts.map((resource) => this.toEntityFromResource(resource));
  }
}
