import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Building } from './building.entity';
import { DeviceStatus } from './device-status';
import { DeviceType } from './device-type';

/**
 * device of a building: water pump, electrical panel, elevator or hvac.
 */
export class Device implements BaseEntity {
  #id: number;
  #buildingId: number;
  #code: string;
  #name: string;
  #type: DeviceType;
  #location: string;
  #installationDate: Date;
  #status: DeviceStatus;
  #building: Building | null;

  constructor(props: {
    id: number;
    buildingId: number;
    code: string;
    name: string;
    type: DeviceType;
    location: string;
    installationDate: Date;
    status: DeviceStatus;
    building?: Building | null;
  }) {
    this.#id = props.id;
    this.#buildingId = props.buildingId;
    this.#code = props.code;
    this.#name = props.name;
    this.#type = props.type;
    this.#location = props.location;
    this.#installationDate = props.installationDate;
    this.#status = props.status;
    this.#building = props.building ?? null;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get buildingId(): number {
    return this.#buildingId;
  }
  set buildingId(value: number) {
    this.#buildingId = value;
  }

  get code(): string {
    return this.#code;
  }
  set code(value: string) {
    this.#code = value;
  }

  get name(): string {
    return this.#name;
  }
  set name(value: string) {
    this.#name = value;
  }

  get type(): DeviceType {
    return this.#type;
  }
  set type(value: DeviceType) {
    this.#type = value;
  }

  get location(): string {
    return this.#location;
  }
  set location(value: string) {
    this.#location = value;
  }

  get installationDate(): Date {
    return this.#installationDate;
  }
  set installationDate(value: Date) {
    this.#installationDate = value;
  }

  get status(): DeviceStatus {
    return this.#status;
  }
  set status(value: DeviceStatus) {
    this.#status = value;
  }

  get building(): Building | null {
    return this.#building;
  }
  set building(value: Building | null) {
    this.#building = value;
  }

  /**
   * a device is operational when it works without pending follow-up.
   */
  isOperational(): boolean {
    return this.#status === DeviceStatus.OPERATIONAL;
  }

  /**
   * whether the device was taken out of service permanently (US09).
   */
  isDecommissioned(): boolean {
    return this.#status === DeviceStatus.DECOMMISSIONED;
  }

  /**
   * takes the device out of service permanently (US09).
   * the device is not deleted, so its history is kept.
   */
  decommission(): void {
    this.#status = DeviceStatus.DECOMMISSIONED;
  }
}
