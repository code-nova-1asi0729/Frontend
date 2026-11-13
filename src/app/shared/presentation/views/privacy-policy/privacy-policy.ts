import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy',
  imports: [TranslatePipe],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy {
  readonly sections = ['data', 'purpose', 'sharing', 'storage', 'rights', 'contact'];
}
