import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Device } from '../domain/model/device.entity';
import { DeviceResource, DevicesResponse } from './devices-response';
import { DeviceAssembler } from './device-assembler';

/**
 * REST client for /devices.
 */
export class DevicesApiEndpoint extends BaseApiEndpoint<
  Device,
  DeviceResource,
  DevicesResponse,
  DeviceAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderDevicesEndpointPath}`,
      new DeviceAssembler(),
    );
  }
}
