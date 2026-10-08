import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * one measurement sent by a sensor (US14).
 */
export class SensorReading implements BaseEntity {
  #id: number;
  #sensorId: number;
  #equipmentId: number;
  #metric: string;
  #value: number;
  #unit: string;
  #status: string;
  #recordedAt: Date;

  constructor(props: {
    id: number;
    sensorId: number;
    equipmentId: number;
    metric: string;
    value: number;
    unit: string;
    status: string;
    recordedAt: Date;
  }) {
    this.#id = props.id;
    this.#sensorId = props.sensorId;
    this.#equipmentId = props.equipmentId;
    this.#metric = props.metric;
    this.#value = props.value;
    this.#unit = props.unit;
    this.#status = props.status;
    this.#recordedAt = props.recordedAt;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get sensorId(): number {
    return this.#sensorId;
  }
  set sensorId(value: number) {
    this.#sensorId = value;
  }

  get equipmentId(): number {
    return this.#equipmentId;
  }
  set equipmentId(value: number) {
    this.#equipmentId = value;
  }

  get metric(): string {
    return this.#metric;
  }
  set metric(value: string) {
    this.#metric = value;
  }

  get value(): number {
    return this.#value;
  }
  set value(value: number) {
    this.#value = value;
  }

  get unit(): string {
    return this.#unit;
  }
  set unit(value: string) {
    this.#unit = value;
  }

  get status(): string {
    return this.#status;
  }
  set status(value: string) {
    this.#status = value;
  }

  get recordedAt(): Date {
    return this.#recordedAt;
  }
  set recordedAt(value: Date) {
    this.#recordedAt = value;
  }

  /**
   * a reading is valid when the sensor flagged it as a correct measurement.
   */
  isValid(): boolean {
    return this.#status === 'VALID';
  }
}
