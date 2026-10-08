import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { CriticalEquipment } from '../domain/model/critical-equipment.entity';
import { EquipmentResource, EquipmentResponse } from './equipment-response';
import { EquipmentAssembler } from './equipment-assembler';

/**
 * REST client for /equipment.
 */
export class EquipmentApiEndpoint extends BaseApiEndpoint<
  CriticalEquipment,
  EquipmentResource,
  EquipmentResponse,
  EquipmentAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderEquipmentEndpointPath}`,
      new EquipmentAssembler(),
    );
  }
}
