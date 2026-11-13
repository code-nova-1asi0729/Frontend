import { formatDate } from '@angular/common';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Device } from '../domain/model/device.entity';
import { DeviceStatus } from '../domain/model/device-status';
import { DeviceType } from '../domain/model/device-type';
import { DeviceResource, DevicesResponse } from './devices-response';

/**
 * maps devices between the API and the domain model.
 */
export class DeviceAssembler implements BaseAssembler<
  Device,
  DeviceResource,
  DevicesResponse
> {
  toEntityFromResource(resource: DeviceResource): Device {
    return new Device({
      ...resource,
      type: resource.type as DeviceType,
      status: resource.status as DeviceStatus,
      // Read as local date so the day does not shift with the time zone
      installationDate: new Date(`${resource.installationDate}T00:00:00`),
    });
  }

  toResourceFromEntity(entity: Device): DeviceResource {
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

  toEntitiesFromResponse(response: DevicesResponse): Device[] {
    return response.devices.map((resource) => this.toEntityFromResource(resource));
  }
}
