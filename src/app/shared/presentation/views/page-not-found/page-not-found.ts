import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * fallback view for unknown routes.
 */
@Component({
  selector: 'app-page-not-found',
  imports: [MatButtonModule, TranslatePipe],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css',
})
export class PageNotFound {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /**
   * path that the user tried to open.
   */
  invalidPath = this.route.snapshot.url.map((segment) => segment.path).join('/');

  /**
   * goes back to the home view.
   */
  navigateToHome(): void {
    this.router.navigate(['/home']).then();
  }
}
