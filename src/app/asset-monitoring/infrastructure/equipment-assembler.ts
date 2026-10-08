import { formatDate } from '@angular/common';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CriticalEquipment } from '../domain/model/critical-equipment.entity';
import { EquipmentStatus } from '../domain/model/equipment-status';
import { EquipmentType } from '../domain/model/equipment-type';
import { EquipmentResource, EquipmentResponse } from './equipment-response';

/**
 * maps critical equipment between the API and the domain model.
 */
export class EquipmentAssembler implements BaseAssembler<
  CriticalEquipment,
  EquipmentResource,
  EquipmentResponse
> {
  toEntityFromResource(resource: EquipmentResource): CriticalEquipment {
    return new CriticalEquipment({
      ...resource,
      type: resource.type as EquipmentType,
      status: resource.status as EquipmentStatus,
      // Read as local date so the day does not shift with the time zone
      installationDate: new Date(`${resource.installationDate}T00:00:00`),
    });
  }

  toResourceFromEntity(entity: CriticalEquipment): EquipmentResource {
    return {
      id: entity.id,
      buildingId: entity.buildingId,
      code: entity.code,
      name: entity.name,
      type: entity.type,
      location: entity.location,
      installationDate: formatDate(entity.installationDate, 'yyyy-MM-dd', 'en-US'),
      status: entity.status,
    };
  }

  toEntitiesFromResponse(response: EquipmentResponse): CriticalEquipment[] {
    return response.equipment.map((resource) => this.toEntityFromResource(resource));
  }
}
