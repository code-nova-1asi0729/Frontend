import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Building } from '../domain/model/building.entity';
import { BuildingsApiEndpoint } from './buildings-api-endpoint';
import { CriticalEquipment } from '../domain/model/critical-equipment.entity';
import { EquipmentApiEndpoint } from './equipment-api-endpoint';
import { Alert } from '../domain/model/alert.entity';
import { AlertsApiEndpoint } from './alerts-api-endpoint';
import { Sensor } from '../domain/model/sensor.entity';
import { SensorsApiEndpoint } from './sensors-api-endpoint';
import { SensorReading } from '../domain/model/sensor-reading.entity';
import { SensorReadingsApiEndpoint } from './sensor-readings-api-endpoint';

/**
 * API facade of the asset monitoring bounded context.
 */
@Injectable({ providedIn: 'root' })
export class AssetMonitoringApi extends BaseApi {
  private http = inject(HttpClient);
  private buildingsEndpoint = new BuildingsApiEndpoint(this.http);
  private equipmentEndpoint = new EquipmentApiEndpoint(this.http);
  private alertsEndpoint = new AlertsApiEndpoint(this.http);
  private sensorsEndpoint = new SensorsApiEndpoint(this.http);
  private sensorReadingsEndpoint = new SensorReadingsApiEndpoint(this.http);

  getBuildings(): Observable<Building[]> {
    return this.buildingsEndpoint.getAll();
  }

  createBuilding(building: Building): Observable<Building> {
    return this.buildingsEndpoint.create(building);
  }

  updateBuilding(building: Building): Observable<Building> {
    return this.buildingsEndpoint.update(building, building.id);
  }

  deleteBuilding(id: number): Observable<void> {
    return this.buildingsEndpoint.delete(id);
  }

  getEquipment(): Observable<CriticalEquipment[]> {
    return this.equipmentEndpoint.getAll();
  }

  createEquipment(equipment: CriticalEquipment): Observable<CriticalEquipment> {
    return this.equipmentEndpoint.create(equipment);
  }

  updateEquipment(equipment: CriticalEquipment): Observable<CriticalEquipment> {
    return this.equipmentEndpoint.update(equipment, equipment.id);
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertsEndpoint.getAll();
  }

  updateAlert(alert: Alert): Observable<Alert> {
    return this.alertsEndpoint.update(alert, alert.id);
  }

  getSensors(): Observable<Sensor[]> {
    return this.sensorsEndpoint.getAll();
  }

  updateSensor(sensor: Sensor): Observable<Sensor> {
    return this.sensorsEndpoint.update(sensor, sensor.id);
  }

  getSensorReadings(): Observable<SensorReading[]> {
    return this.sensorReadingsEndpoint.getAll();
  }
}
