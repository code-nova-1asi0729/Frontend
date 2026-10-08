import { Component, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

/**
 * width below which the side menu is hidden behind a menu button.
 */
const COMPACT_LAYOUT_QUERY = '(max-width: 959.98px)';

/**
 * application shell: vertical side navigation and routed content.
 */
@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    LanguageSwitcher,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private breakpointObserver = inject(BreakpointObserver);

  readonly sidenav = viewChild(MatSidenav);

  /**
   * true on phones and small tablets, where the menu opens over the content.
   */
  readonly isCompact = toSignal(
    this.breakpointObserver.observe(COMPACT_LAYOUT_QUERY).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  /**
   * navigation options. each bounded context adds its own entries.
   */
  options = signal([
    { link: '/home', label: 'option.home', icon: 'home' },
    { link: '/asset-monitoring/buildings', label: 'option.buildings', icon: 'apartment' },
    {
      link: '/asset-monitoring/equipment',
      label: 'option.equipment',
      icon: 'precision_manufacturing',
    },
    { link: '/asset-monitoring/alerts', label: 'option.alerts', icon: 'warning_amber' },
    { link: '/asset-monitoring/sensors', label: 'option.sensors', icon: 'sensors' },
    { link: '/asset-monitoring/readings', label: 'option.readings', icon: 'show_chart' },
    { link: '/incidents', label: 'option.incidents', icon: 'chat_bubble_outline' },
  ]);

  /**
   * closes the menu after choosing an option on small screens.
   */
  closeIfCompact(): void {
    if (this.isCompact()) this.sidenav()?.close();
  }
}
