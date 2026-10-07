import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';
import { Building } from '../../../domain/model/building.entity';

/**
 * Registers or edits a building (US07).
 */
@Component({
  selector: 'app-building-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslatePipe],
  templateUrl: './building-form.html',
  styleUrl: './building-form.css',
})
export class BuildingForm extends BaseForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(AssetMonitoringStore);

  private buildingId = Number(this.route.snapshot.paramMap.get('id')) || null;

  isEdit = this.buildingId !== null;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(140)]],
    code: ['', [Validators.required, Validators.maxLength(30)]],
    address: ['', Validators.required],
    district: ['', Validators.required],
    totalUnits: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    super();
    if (this.buildingId) {
      const building = this.store.getBuildingById(this.buildingId);
      // The store may still be loading when the user opens the edit URL directly
      effect(() => {
        const current = building();
        if (current) this.form.patchValue({ ...this.toFormValue(current) });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const building = new Building({
      id: this.buildingId ?? 0,
      ...this.form.getRawValue(),
      status: 'ACTIVE',
    });
    if (this.isEdit) this.store.updateBuilding(building);
    else this.store.addBuilding(building);
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/asset-monitoring/buildings']).then();
  }

  private toFormValue(building: Building) {
    return {
      name: building.name,
      code: building.code,
      address: building.address,
      district: building.district,
      totalUnits: building.totalUnits,
    };
  }
}
