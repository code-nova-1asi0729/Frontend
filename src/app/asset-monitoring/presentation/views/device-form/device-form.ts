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
 * Registers or edits a device of a building (US11).
 */
@Component({
  selector: 'app-device-form',
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
  templateUrl: './device-form.html',
  styleUrl: './device-form.css',
})
export class DeviceForm extends BaseForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(AssetMonitoringStore);

  private deviceId = Number(this.route.snapshot.paramMap.get('id')) || null;

  isEdit = this.deviceId !== null;

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
    if (this.deviceId) {
      const device = this.store.getDeviceById(this.deviceId);
      // The store may still be loading when the user opens the edit URL directly
      effect(() => {
        const current = device();
        if (current) this.form.patchValue({ ...this.toFormValue(current) });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const device = new Device({
      id: this.deviceId ?? 0,
      buildingId: value.buildingId!,
      code: value.code,
      name: value.name,
      type: value.type!,
      location: value.location,
      installationDate: value.installationDate!,
      status: value.status,
    });
    if (this.isEdit) this.store.updateDevice(device);
    else this.store.addDevice(device);
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/asset-monitoring/devices']).then();
  }

  private toFormValue(device: Device) {
    return {
      buildingId: device.buildingId,
      code: device.code,
      name: device.name,
      type: device.type,
      location: device.location,
      installationDate: device.installationDate,
      status: device.status,
    };
  }
}
