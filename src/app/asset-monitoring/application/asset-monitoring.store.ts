import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetMonitoringApi } from '../infrastructure/asset-monitoring-api';
import { Building } from '../domain/model/building.entity';
import { Device } from '../domain/model/device.entity';
import { Alert } from '../domain/model/alert.entity';
import { AlertStatus } from '../domain/model/alert-status';
import { Sensor } from '../domain/model/sensor.entity';
import { SensorReading } from '../domain/model/sensor-reading.entity';

/**
 * application state of the asset monitoring bounded context.
 * one store for the whole context: buildings, devices, sensors, readings and alerts.
 */
@Injectable({ providedIn: 'root' })
export class AssetMonitoringStore {
  private assetMonitoringApi = inject(AssetMonitoringApi);

  private buildingsSignal = signal<Building[]>([]);
  private devicesSignal = signal<Device[]>([]);
  private alertsSignal = signal<Alert[]>([]);
  private sensorsSignal = signal<Sensor[]>([]);
  private readingsSignal = signal<SensorReading[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly buildings = this.buildingsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly readings = this.readingsSignal.asReadonly();

  /**
   * devices linked with their building.
   */
  readonly devices = computed(() => {
    const buildings = this.buildings();
    return this.devicesSignal().map((item) => {
      item.building = buildings.find((building) => building.id === item.buildingId) ?? null;
      return item;
    });
  });

  /**
   * alerts linked with the device they affect.
   */
  readonly alerts = computed(() => {
    const devices = this.devices();
    return this.alertsSignal().map((alert) => {
      alert.device = devices.find((item) => item.id === alert.deviceId) ?? null;
      return alert;
    });
  });

  /**
   * alerts that are not resolved yet, the most severe first (US19).
   */
  readonly activeAlerts = computed(() =>
    this.alerts()
      .filter((alert) => alert.isActive())
      .sort(
        (a, b) =>
          b.severityRank() - a.severityRank() || b.detectedAt.getTime() - a.detectedAt.getTime(),
      ),
  );

  /**
   * sensors linked with the device they measure.
   */
  readonly sensors = computed(() => {
    const devices = this.devices();
    return this.sensorsSignal().map((sensor) => {
      sensor.device = devices.find((device) => device.id === sensor.deviceId) ?? null;
      return sensor;
    });
  });

  constructor() {
    this.loadAll();
  }

  /**
   * returns a building by id, or undefined while it is not loaded.
   * @param id - building identifier.
   */
  getBuildingById(id: number): Signal<Building | undefined> {
    return computed(() => this.buildings().find((building) => building.id === id));
  }

  addBuilding(building: Building): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.createBuilding(building).subscribe({
      next: (created) => {
        this.buildingsSignal.update((buildings) => [...buildings, created]);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to create building'),
    });
  }

  updateBuilding(building: Building): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.updateBuilding(building).subscribe({
      next: (updated) => {
        this.buildingsSignal.update((buildings) =>
          buildings.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update building'),
    });
  }

  deleteBuilding(id: number): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.deleteBuilding(id).subscribe({
      next: () => {
        this.buildingsSignal.update((buildings) => buildings.filter((b) => b.id !== id));
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to delete building'),
    });
  }

  /**
   * returns a device by id, or undefined while it is not loaded.
   * @param id - device identifier.
   */
  getDeviceById(id: number): Signal<Device | undefined> {
    return computed(() => this.devices().find((item) => item.id === id));
  }

  /**
   * returns the devices of one building (US08).
   * @param buildingId - building identifier.
   */
  getDevicesByBuilding(buildingId: number): Signal<Device[]> {
    return computed(() => this.devices().filter((item) => item.buildingId === buildingId));
  }

  addDevice(device: Device): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.createDevice(device).subscribe({
      next: (created) => {
        this.devicesSignal.update((items) => [...items, created]);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to create device'),
    });
  }

  updateDevice(device: Device): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.updateDevice(device).subscribe({
      next: (updated) => {
        this.devicesSignal.update((items) =>
          items.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update device'),
    });
  }

  /**
   * takes a device out of service (US09). it is updated, never deleted.
   * @param device - device to decommission.
   */
  decommissionDevice(device: Device): void {
    device.decommission();
    this.updateDevice(device);
  }

  /**
   * moves an alert to "acknowledged" or "resolved" (US20).
   * the entity validates the change and the api runs the matching command.
   * @param alert - alert to change.
   * @param status - new status.
   */
  changeAlertStatus(alert: Alert, status: AlertStatus): void {
    try {
      if (status === AlertStatus.ACKNOWLEDGED) alert.acknowledge();
      else if (status === AlertStatus.RESOLVED) alert.resolve();
    } catch (error) {
      this.setError(error, 'Invalid alert status change');
      return;
    }
    const request =
      status === AlertStatus.ACKNOWLEDGED
        ? this.assetMonitoringApi.acknowledgeAlert(alert.id)
        : this.assetMonitoringApi.resolveAlert(alert.id);
    this.loadingSignal.set(true);
    request.subscribe({
      next: (updated) => {
        this.alertsSignal.update((alerts) =>
          alerts.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update alert'),
    });
  }

  /**
   * readings of one device, the most recent first (US14).
   * @param deviceId - device identifier.
   */
  getReadingsByDevice(deviceId: number): Signal<SensorReading[]> {
    return computed(() =>
      this.readings()
        .filter((reading) => reading.deviceId === deviceId)
        .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime()),
    );
  }

  /**
   * links a sensor to a device (US10).
   * if the sensor already has a device, the error is kept and the API is not called.
   * @param sensor - sensor to assign.
   * @param deviceId - device that the sensor will measure.
   */
  assignSensor(sensor: Sensor, deviceId: number): void {
    this.errorSignal.set(null);
    try {
      sensor.assignTo(deviceId);
    } catch (error) {
      this.setError(error, 'The sensor cannot be assigned');
      return;
    }
    this.saveSensor(this.assetMonitoringApi.assignSensor(sensor.id, deviceId));
  }

  /**
   * releases a sensor so it can be assigned to another device.
   * @param sensor - sensor to unassign.
   */
  unassignSensor(sensor: Sensor): void {
    this.errorSignal.set(null);
    sensor.unassign();
    this.saveSensor(this.assetMonitoringApi.releaseSensor(sensor.id));
  }

  /**
   * gets the latest readings sent by the sensors, and their last signal.
   */
  reloadReadings(): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.getSensorReadings().subscribe({
      next: (readings) => {
        this.readingsSignal.set(readings);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to load readings'),
    });
    this.assetMonitoringApi.getSensors().subscribe({
      next: (sensors) => this.sensorsSignal.set(sensors),
      error: (error) => this.setError(error, 'Failed to load sensors'),
    });
  }

  private saveSensor(request: Observable<Sensor>): void {
    this.loadingSignal.set(true);
    request.subscribe({
      next: (updated) => {
        this.sensorsSignal.update((sensors) =>
          sensors.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update sensor'),
    });
  }

  /**
   * loads the initial data of the context. add here the loaders of new resources.
   */
  private loadAll(): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.getBuildings().subscribe({
      next: (buildings) => {
        this.buildingsSignal.set(buildings);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to load buildings'),
    });
    this.assetMonitoringApi.getDevices().subscribe({
      next: (devices) => this.devicesSignal.set(devices),
      error: (error) => this.setError(error, 'Failed to load devices'),
    });
    this.assetMonitoringApi.getAlerts().subscribe({
      next: (alerts) => this.alertsSignal.set(alerts),
      error: (error) => this.setError(error, 'Failed to load alerts'),
    });
    this.assetMonitoringApi.getSensors().subscribe({
      next: (sensors) => this.sensorsSignal.set(sensors),
      error: (error) => this.setError(error, 'Failed to load sensors'),
    });
    this.assetMonitoringApi.getSensorReadings().subscribe({
      next: (readings) => this.readingsSignal.set(readings),
      error: (error) => this.setError(error, 'Failed to load readings'),
    });
  }

  private setError(error: unknown, fallback: string): void {
    this.errorSignal.set(this.formatError(error, fallback));
    this.loadingSignal.set(false);
  }

  private formatError(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
