import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { SensorReading } from '../domain/model/sensor-reading.entity';
import { SensorReadingResource, SensorReadingsResponse } from './sensor-readings-response';
import { SensorReadingAssembler } from './sensor-reading-assembler';

/**
 * REST client for /sensor-readings.
 */
export class SensorReadingsApiEndpoint extends BaseApiEndpoint<
  SensorReading,
  SensorReadingResource,
  SensorReadingsResponse,
  SensorReadingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderSensorReadingsEndpointPath}`,
      new SensorReadingAssembler(),
    );
  }
}
