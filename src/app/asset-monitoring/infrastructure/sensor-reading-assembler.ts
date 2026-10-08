import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SensorReading } from '../domain/model/sensor-reading.entity';
import { SensorReadingResource, SensorReadingsResponse } from './sensor-readings-response';

/**
 * maps sensor readings between the API and the domain model.
 */
export class SensorReadingAssembler implements BaseAssembler<
  SensorReading,
  SensorReadingResource,
  SensorReadingsResponse
> {
  toEntityFromResource(resource: SensorReadingResource): SensorReading {
    return new SensorReading({ ...resource, recordedAt: new Date(resource.recordedAt) });
  }

  toResourceFromEntity(entity: SensorReading): SensorReadingResource {
    return {
      id: entity.id,
      sensorId: entity.sensorId,
      equipmentId: entity.equipmentId,
      metric: entity.metric,
      value: entity.value,
      unit: entity.unit,
      status: entity.status,
      recordedAt: entity.recordedAt.toISOString(),
    };
  }

  toEntitiesFromResponse(response: SensorReadingsResponse): SensorReading[] {
    return response.readings.map((resource) => this.toEntityFromResource(resource));
  }
}
