import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';
import { Device } from '../../../domain/model/device.entity';
import { DeviceStatus } from '../../../domain/model/device-status';
import { DeviceType } from '../../../domain/model/device-type';

/**
 * Registers or edits a critical equipment of a building (US11).
 */
@Component({
  selector: 'app-equipment-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    TranslatePipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './equipment-form.html',
  styleUrl: './equipment-form.css',
})
export class EquipmentForm extends BaseForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(AssetMonitoringStore);

  private equipmentId = Number(this.route.snapshot.paramMap.get('id')) || null;

  isEdit = this.equipmentId !== null;

  readonly types = Object.values(DeviceType);
  readonly statuses = Object.values(DeviceStatus);
  readonly today = new Date();

  form = this.fb.nonNullable.group({
    // The list sends the filtered building so the user does not pick it again
    buildingId: this.fb.control<number | null>(
      Number(this.route.snapshot.queryParamMap.get('buildingId')) || null,
      Validators.required,
    ),
    code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{2,30}$/)]],
    name: ['', [Validators.required, Validators.maxLength(140)]],
    type: this.fb.control<DeviceType | null>(null, Validators.required),
    location: ['', [Validators.required, Validators.maxLength(140)]],
    installationDate: this.fb.control<Date | null>(null, Validators.required),
    status: [DeviceStatus.OPERATIONAL, Validators.required],
  });

  constructor() {
    super();
    if (this.equipmentId) {
      const equipment = this.store.getDeviceById(this.equipmentId);
      // The store may still be loading when the user opens the edit URL directly
      effect(() => {
        const current = equipment();
        if (current) this.form.patchValue({ ...this.toFormValue(current) });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const equipment = new Device({
      id: this.equipmentId ?? 0,
      buildingId: value.buildingId!,
      code: value.code,
      name: value.name,
      type: value.type!,
      location: value.location,
      installationDate: value.installationDate!,
      status: value.status,
    });
    if (this.isEdit) this.store.updateDevice(equipment);
    else this.store.addDevice(equipment);
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/asset-monitoring/equipment']).then();
  }

  private toFormValue(equipment: Device) {
    return {
      buildingId: equipment.buildingId,
      code: equipment.code,
      name: equipment.name,
      type: equipment.type,
      location: equipment.location,
      installationDate: equipment.installationDate,
      status: equipment.status,
    };
  }
}
