import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Alert } from '../domain/model/alert.entity';
import { AlertResource, AlertsResponse } from './alerts-response';
import { AlertAssembler } from './alert-assembler';

/**
 * REST client for /alerts.
 */
export class AlertsApiEndpoint extends BaseApiEndpoint<
  Alert,
  AlertResource,
  AlertsResponse,
  AlertAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderAlertsEndpointPath}`,
      new AlertAssembler(),
    );
  }

  /**
   * acknowledges an active alert (POST /alerts/{id}/acknowledgements).
   * @param id - alert identifier.
   */
  acknowledge(id: number): Observable<Alert> {
    return this.http.post<AlertResource>(`${this.endpointUrl}/${id}/acknowledgements`, {}).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to acknowledge alert')),
    );
  }

  /**
   * resolves an alert (POST /alerts/{id}/resolutions).
   * @param id - alert identifier.
   */
  resolve(id: number): Observable<Alert> {
    return this.http.post<AlertResource>(`${this.endpointUrl}/${id}/resolutions`, {}).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to resolve alert')),
    );
  }
}
