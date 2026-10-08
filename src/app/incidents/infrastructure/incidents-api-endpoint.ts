import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Incident } from '../domain/model/incident.entity';
import { IncidentResource, IncidentsResponse } from './incidents-response';
import { IncidentAssembler } from './incident-assembler';

/**
 * REST client for /incidents.
 */
export class IncidentsApiEndpoint extends BaseApiEndpoint<
  Incident,
  IncidentResource,
  IncidentsResponse,
  IncidentAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderIncidentsEndpointPath}`,
      new IncidentAssembler(),
    );
  }
}
