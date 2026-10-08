import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { AssetMonitoringStore } from '../../../../asset-monitoring/application/asset-monitoring.store';
import { IncidentsStore } from '../../../application/incidents.store';
import { Incident } from '../../../domain/model/incident.entity';
import { IncidentCategory } from '../../../domain/model/incident-category';
import { IncidentStatus } from '../../../domain/model/incident-status';

/**
 * Resident who reports the incidents.
 * Fixed until the IAM bounded context provides the signed-in user.
 */
const CURRENT_RESIDENT_ID = 3;

/**
 * Reports a problem in a common area of the building (US23).
 */
@Component({
  selector: 'app-incident-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslatePipe,
  ],
  templateUrl: './incident-form.html',
  styleUrl: './incident-form.css',
})
export class IncidentForm extends BaseForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(IncidentsStore);
  // Only read between contexts: the buildings and equipment of Asset Monitoring
  readonly assetMonitoringStore = inject(AssetMonitoringStore);

  readonly categories = Object.values(IncidentCategory);

  form = this.fb.nonNullable.group({
    buildingId: this.fb.control<number | null>(null, Validators.required),
    equipmentId: this.fb.control<number | null>(null),
    category: this.fb.control<IncidentCategory | null>(null, Validators.required),
    description: ['', [Validators.required, Validators.maxLength(500)]],
  });

  private readonly buildingId = toSignal(this.form.controls.buildingId.valueChanges, {
    initialValue: null,
  });

  /**
   * equipment of the chosen building that is still in service.
   */
  readonly buildingEquipment = computed(() => {
    const buildingId = this.buildingId();
    if (buildingId === null) return [];
    return this.assetMonitoringStore
      .equipment()
      .filter((item) => item.buildingId === buildingId && !item.isDecommissioned());
  });

  constructor() {
    super();
    // The equipment belongs to one building, so it is cleared when the building changes
    this.form.controls.buildingId.valueChanges.subscribe(() =>
      this.form.controls.equipmentId.setValue(null),
    );
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const incident = new Incident({
      id: 0,
      buildingId: value.buildingId!,
      residentId: CURRENT_RESIDENT_ID,
      equipmentId: value.equipmentId,
      category: value.category!,
      description: value.description.trim(),
      status: IncidentStatus.REPORTED,
      ratingScore: null,
      ratingComment: null,
      reportedAt: new Date(),
      startedAt: null,
      resolvedAt: null,
      ratedAt: null,
    });
    this.store.reportIncident(incident);
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/incidents']).then();
  }
}
