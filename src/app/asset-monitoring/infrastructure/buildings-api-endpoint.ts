import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Building } from '../domain/model/building.entity';
import { BuildingResource, BuildingsResponse } from './buildings-response';
import { BuildingAssembler } from './building-assembler';

/**
 * REST client for /buildings.
 */
export class BuildingsApiEndpoint extends BaseApiEndpoint<
  Building,
  BuildingResource,
  BuildingsResponse,
  BuildingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderBuildingsEndpointPath}`,
      new BuildingAssembler(),
    );
  }
}
