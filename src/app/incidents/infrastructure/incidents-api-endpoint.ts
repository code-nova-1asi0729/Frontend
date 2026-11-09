import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
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

  /**
   * starts the management of a reported incident (POST /incidents/{id}/management-starts).
   * @param id - incident identifier.
   */
  startManagement(id: number): Observable<Incident> {
    return this.http.post<IncidentResource>(`${this.endpointUrl}/${id}/management-starts`, {}).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to start incident management')),
    );
  }

  /**
   * resolves an incident in progress (POST /incidents/{id}/resolutions).
   * @param id - incident identifier.
   */
  resolve(id: number): Observable<Incident> {
    return this.http.post<IncidentResource>(`${this.endpointUrl}/${id}/resolutions`, {}).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to resolve incident')),
    );
  }

  /**
   * rates a resolved incident (POST /incidents/{id}/ratings).
   * @param id - incident identifier.
   * @param score - score from 1 to 5.
   * @param comment - optional comment of the resident.
   */
  rate(id: number, score: number, comment: string): Observable<Incident> {
    return this.http
      .post<IncidentResource>(`${this.endpointUrl}/${id}/ratings`, { score, comment: comment.trim() || null })
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to rate incident')),
      );
  }
}
