import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { AlertSeverity } from './alert-severity';
import { AlertStatus } from './alert-status';
import { CriticalEquipment } from './critical-equipment.entity';

/**
 * rank of each severity. a higher number is more urgent.
 */
const SEVERITY_RANK: Record<AlertSeverity, number> = {
  [AlertSeverity.LOW]: 0,
  [AlertSeverity.MEDIUM]: 1,
  [AlertSeverity.HIGH]: 2,
  [AlertSeverity.CRITICAL]: 3,
};

/**
 * anomaly detected on a metric of a critical equipment.
 */
export class Alert implements BaseEntity {
  #id: number;
  #equipmentId: number;
  #metric: string;
  #severity: AlertSeverity;
  #status: AlertStatus;
  #lastValue: number;
  #detectedAt: Date;
  #equipment: CriticalEquipment | null;

  constructor(props: {
    id: number;
    equipmentId: number;
    metric: string;
    severity: AlertSeverity;
    status: AlertStatus;
    lastValue: number;
    detectedAt: Date;
    equipment?: CriticalEquipment | null;
  }) {
    this.#id = props.id;
    this.#equipmentId = props.equipmentId;
    this.#metric = props.metric;
    this.#severity = props.severity;
    this.#status = props.status;
    this.#lastValue = props.lastValue;
    this.#detectedAt = props.detectedAt;
    this.#equipment = props.equipment ?? null;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
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

  get severity(): AlertSeverity {
    return this.#severity;
  }
  set severity(value: AlertSeverity) {
    this.#severity = value;
  }

  get status(): AlertStatus {
    return this.#status;
  }
  set status(value: AlertStatus) {
    this.#status = value;
  }

  get lastValue(): number {
    return this.#lastValue;
  }
  set lastValue(value: number) {
    this.#lastValue = value;
  }

  get detectedAt(): Date {
    return this.#detectedAt;
  }
  set detectedAt(value: Date) {
    this.#detectedAt = value;
  }

  get equipment(): CriticalEquipment | null {
    return this.#equipment;
  }
  set equipment(value: CriticalEquipment | null) {
    this.#equipment = value;
  }

  /**
   * an alert stays active until it is resolved, even while it is being managed.
   */
  isActive(): boolean {
    return this.#status !== AlertStatus.RESOLVED;
  }

  /**
   * numeric rank of the severity: LOW = 0 ... CRITICAL = 3.
   */
  severityRank(): number {
    return SEVERITY_RANK[this.#severity];
  }

  /**
   * marks the alert as being managed (US20). only an ACTIVE alert can be acknowledged.
   */
  acknowledge(): void {
    if (this.#status !== AlertStatus.ACTIVE) {
      throw new Error('Only an active alert can be acknowledged');
    }
    this.#status = AlertStatus.ACKNOWLEDGED;
  }

  /**
   * closes the alert (US20).
   */
  resolve(): void {
    if (this.#status === AlertStatus.RESOLVED) {
      throw new Error('The alert is already resolved');
    }
    this.#status = AlertStatus.RESOLVED;
  }
}
