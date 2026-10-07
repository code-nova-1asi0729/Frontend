import { FormGroup } from '@angular/forms';

/**
 * validation helpers shared by reactive form views.
 */
export abstract class BaseForm {
  /**
   * checks if a control is invalid and was already touched by the user.
   * @param form - form that contains the control.
   * @param controlName - name of the control.
   */
  protected isInvalidControl(form: FormGroup, controlName: string): boolean {
    const control = form.controls[controlName];
    return control.invalid && control.touched;
  }

  /**
   * returns the i18n key of the first validation error of a control.
   * @param form - form that contains the control.
   * @param controlName - name of the control.
   */
  protected errorMessageForControl(form: FormGroup, controlName: string): string {
    const errors = form.controls[controlName].errors;
    if (!errors) return '';
    if (errors['required']) return 'validation.required';
    if (errors['min']) return 'validation.min';
    if (errors['maxlength']) return 'validation.max-length';
    return 'validation.invalid';
  }
}
