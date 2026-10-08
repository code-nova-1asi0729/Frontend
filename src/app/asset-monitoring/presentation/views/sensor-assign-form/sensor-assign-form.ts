import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';

/**
 * Assigns a sensor to a critical equipment (US10).
 */
@Component({
  selector: 'app-sensor-assign-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    TranslatePipe,
  ],
  templateUrl: './sensor-assign-form.html',
  styleUrl: './sensor-assign-form.css',
})
export class SensorAssignForm extends BaseForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(AssetMonitoringStore);

  private sensorId = Number(this.route.snapshot.paramMap.get('id'));

  readonly sensor = computed(() => this.store.sensors().find((item) => item.id === this.sensorId));

  /**
   * a decommissioned equipment cannot receive sensors.
   */
  readonly availableEquipment = computed(() =>
    this.store.equipment().filter((item) => !item.isDecommissioned()),
  );

  form = this.fb.nonNullable.group({
    equipmentId: this.fb.control<number | null>(null, Validators.required),
  });

  submit(): void {
    const sensor = this.sensor();
    const equipmentId = this.form.getRawValue().equipmentId;
    if (this.form.invalid || !sensor || equipmentId === null) return;
    this.store.assignSensor(sensor, equipmentId);
    // The store keeps the error when the sensor already has an equipment
    if (!this.store.error()) this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/asset-monitoring/sensors']).then();
  }
}
