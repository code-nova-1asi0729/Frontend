import { formatDate } from '@angular/common';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Device } from '../domain/model/device.entity';
import { DeviceStatus } from '../domain/model/device-status';
import { DeviceType } from '../domain/model/device-type';
import { EquipmentResource, EquipmentResponse } from './equipment-response';

/**
 * maps critical equipment between the API and the domain model.
 */
export class EquipmentAssembler implements BaseAssembler<
  Device,
  EquipmentResource,
  EquipmentResponse
> {
  toEntityFromResource(resource: EquipmentResource): Device {
    return new Device({
      ...resource,
      type: resource.type as DeviceType,
      status: resource.status as DeviceStatus,
      // Read as local date so the day does not shift with the time zone
      installationDate: new Date(`${resource.installationDate}T00:00:00`),
    });
  }

  toResourceFromEntity(entity: Device): EquipmentResource {
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

  toEntitiesFromResponse(response: EquipmentResponse): Device[] {
    return response.equipment.map((resource) => this.toEntityFromResource(resource));
  }
}
