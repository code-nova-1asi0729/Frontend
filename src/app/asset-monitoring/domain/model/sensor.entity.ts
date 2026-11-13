import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Device } from './device.entity';
import { SensorStatus } from './sensor-status';

/**
 * IoT sensor that measures a device.
 * it belongs to only one device at a time.
 */
export class Sensor implements BaseEntity {
  #id: number;
  #deviceId: number | null;
  #serialNumber: string;
  #model: string;
  #status: SensorStatus;
  #lastSeenAt: Date | null;
  #device: Device | null;

  constructor(props: {
    id: number;
    deviceId: number | null;
    serialNumber: string;
    model: string;
    status: SensorStatus;
    lastSeenAt: Date | null;
    device?: Device | null;
  }) {
    this.#id = props.id;
    this.#deviceId = props.deviceId;
    this.#serialNumber = props.serialNumber;
    this.#model = props.model;
    this.#status = props.status;
    this.#lastSeenAt = props.lastSeenAt;
    this.#device = props.device ?? null;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get deviceId(): number | null {
    return this.#deviceId;
  }
  set deviceId(value: number | null) {
    this.#deviceId = value;
  }

  get serialNumber(): string {
    return this.#serialNumber;
  }
  set serialNumber(value: string) {
    this.#serialNumber = value;
  }

  get model(): string {
    return this.#model;
  }
  set model(value: string) {
    this.#model = value;
  }

  get status(): SensorStatus {
    return this.#status;
  }
  set status(value: SensorStatus) {
    this.#status = value;
  }

  get lastSeenAt(): Date | null {
    return this.#lastSeenAt;
  }
  set lastSeenAt(value: Date | null) {
    this.#lastSeenAt = value;
  }

  get device(): Device | null {
    return this.#device;
  }
  set device(value: Device | null) {
    this.#device = value;
  }

  /**
   * whether the sensor is linked to a device.
   */
  isAssigned(): boolean {
    return this.#deviceId !== null;
  }

  /**
   * links the sensor to a device (US10).
   * a sensor that already has a device must be unassigned first.
   * @param deviceId - device that the sensor will measure.
   */
  assignTo(deviceId: number): void {
    if (this.isAssigned()) {
      throw new Error(`Sensor ${this.#serialNumber} is already assigned to another device`);
    }
    this.#deviceId = deviceId;
    this.#status = SensorStatus.ASSIGNED;
  }

  /**
   * releases the sensor so it can be assigned again.
   */
  unassign(): void {
    this.#deviceId = null;
    this.#device = null;
    this.#status = SensorStatus.UNASSIGNED;
  }
}
