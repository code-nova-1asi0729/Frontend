import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Sensor } from '../domain/model/sensor.entity';
import { SensorResource, SensorsResponse } from './sensors-response';
import { SensorAssembler } from './sensor-assembler';

/**
 * REST client for /sensors.
 */
export class SensorsApiEndpoint extends BaseApiEndpoint<
  Sensor,
  SensorResource,
  SensorsResponse,
  SensorAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderSensorsEndpointPath}`,
      new SensorAssembler(),
    );
  }

  /**
   * assigns a sensor to a device (POST /sensors/{id}/assignments).
   * @param id - sensor identifier.
   * @param deviceId - device the sensor will measure.
   */
  assign(id: number, deviceId: number): Observable<Sensor> {
    return this.http.post<SensorResource>(`${this.endpointUrl}/${id}/assignments`, { deviceId }).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to assign sensor')),
    );
  }

  /**
   * releases a sensor from its device (POST /sensors/{id}/releases).
   * @param id - sensor identifier.
   */
  release(id: number): Observable<Sensor> {
    return this.http.post<SensorResource>(`${this.endpointUrl}/${id}/releases`, {}).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to release sensor')),
    );
  }
}
