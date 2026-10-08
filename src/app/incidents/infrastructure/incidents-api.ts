import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Incident } from '../domain/model/incident.entity';
import { IncidentsApiEndpoint } from './incidents-api-endpoint';

/**
 * API facade of the incidents bounded context.
 */
@Injectable({ providedIn: 'root' })
export class IncidentsApi extends BaseApi {
  private http = inject(HttpClient);
  private incidentsEndpoint = new IncidentsApiEndpoint(this.http);

  getIncidents(): Observable<Incident[]> {
    return this.incidentsEndpoint.getAll();
  }

  createIncident(incident: Incident): Observable<Incident> {
    return this.incidentsEndpoint.create(incident);
  }

  updateIncident(incident: Incident): Observable<Incident> {
    return this.incidentsEndpoint.update(incident, incident.id);
  }
}
