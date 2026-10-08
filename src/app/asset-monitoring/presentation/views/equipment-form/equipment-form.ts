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
import { CriticalEquipment } from '../../../domain/model/critical-equipment.entity';
import { EquipmentStatus } from '../../../domain/model/equipment-status';
import { EquipmentType } from '../../../domain/model/equipment-type';

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

  readonly types = Object.values(EquipmentType);
  readonly statuses = Object.values(EquipmentStatus);
  readonly today = new Date();

  form = this.fb.nonNullable.group({
    // The list sends the filtered building so the user does not pick it again
    buildingId: this.fb.control<number | null>(
      Number(this.route.snapshot.queryParamMap.get('buildingId')) || null,
      Validators.required,
    ),
    code: ['', [Validators.required, Validators.maxLength(30)]],
    name: ['', [Validators.required, Validators.maxLength(140)]],
    type: this.fb.control<EquipmentType | null>(null, Validators.required),
    location: ['', [Validators.required, Validators.maxLength(140)]],
    installationDate: this.fb.control<Date | null>(null, Validators.required),
    status: [EquipmentStatus.OPERATIONAL, Validators.required],
  });

  constructor() {
    super();
    if (this.equipmentId) {
      const equipment = this.store.getEquipmentById(this.equipmentId);
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
    const equipment = new CriticalEquipment({
      id: this.equipmentId ?? 0,
      buildingId: value.buildingId!,
      code: value.code,
      name: value.name,
      type: value.type!,
      location: value.location,
      installationDate: value.installationDate!,
      status: value.status,
    });
    if (this.isEdit) this.store.updateEquipment(equipment);
    else this.store.addEquipment(equipment);
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/asset-monitoring/equipment']).then();
  }

  private toFormValue(equipment: CriticalEquipment) {
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
