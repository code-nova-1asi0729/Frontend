import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Sensor } from '../domain/model/sensor.entity';
import { SensorStatus } from '../domain/model/sensor-status';
import { SensorResource, SensorsResponse } from './sensors-response';

/**
 * maps sensors between the API and the domain model.
 */
export class SensorAssembler implements BaseAssembler<Sensor, SensorResource, SensorsResponse> {
  toEntityFromResource(resource: SensorResource): Sensor {
    return new Sensor({
      ...resource,
      status: resource.status as SensorStatus,
      lastSeenAt: resource.lastSeenAt ? new Date(resource.lastSeenAt) : null,
    });
  }

  toResourceFromEntity(entity: Sensor): SensorResource {
    return {
      id: entity.id,
      equipmentId: entity.equipmentId,
      serialNumber: entity.serialNumber,
      model: entity.model,
      status: entity.status,
      lastSeenAt: entity.lastSeenAt ? entity.lastSeenAt.toISOString() : null,
    };
  }

  toEntitiesFromResponse(response: SensorsResponse): Sensor[] {
    return response.sensors.map((resource) => this.toEntityFromResource(resource));
  }
}
