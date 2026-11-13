import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-of-service',
  imports: [TranslatePipe],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.css',
})
export class TermsOfService {
  readonly sections = ['acceptance', 'service', 'use', 'alerts', 'data', 'changes', 'contact'];
}
