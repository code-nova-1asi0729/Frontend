import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Building } from '../domain/model/building.entity';
import { BuildingsApiEndpoint } from './buildings-api-endpoint';
import { CriticalEquipment } from '../domain/model/critical-equipment.entity';
import { EquipmentApiEndpoint } from './equipment-api-endpoint';

/**
 * API facade of the asset monitoring bounded context.
 */
@Injectable({ providedIn: 'root' })
export class AssetMonitoringApi extends BaseApi {
  private http = inject(HttpClient);
  private buildingsEndpoint = new BuildingsApiEndpoint(this.http);
  private equipmentEndpoint = new EquipmentApiEndpoint(this.http);

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
}
