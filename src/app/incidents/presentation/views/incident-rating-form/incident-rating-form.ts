import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { IncidentsStore } from '../../../application/incidents.store';

/**
 * Rates the solution of a resolved incident, only once (US27).
 */
@Component({
  selector: 'app-incident-rating-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    TranslatePipe,
  ],
  templateUrl: './incident-rating-form.html',
  styleUrl: './incident-rating-form.css',
})
export class IncidentRatingForm extends BaseForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(IncidentsStore);

  readonly incident = this.store.getIncidentById(Number(this.route.snapshot.paramMap.get('id')));

  readonly scores = [1, 2, 3, 4, 5];

  form = this.fb.nonNullable.group({
    score: this.fb.control<number | null>(null, Validators.required),
    comment: ['', Validators.maxLength(300)],
  });

  submit(): void {
    const incident = this.incident();
    const { score, comment } = this.form.getRawValue();
    if (this.form.invalid || !incident || score === null) return;
    this.store.rateIncident(incident, score, comment);
    // The store keeps the error when the incident cannot be rated
    if (!this.store.error()) this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/incidents']).then();
  }
}
