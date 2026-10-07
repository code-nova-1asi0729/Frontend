import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateService } from '@ngx-translate/core';

/**
 * switches the language used by the translation service.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);

  /**
   * language currently in use.
   */
  protected currentLang = this.translate.getCurrentLang() ?? 'en';

  /**
   * languages available in the application.
   */
  protected languages = [...this.translate.getLangs()];

  /**
   * changes the language of the application.
   * @param language - language code, for example 'en' or 'es'.
   */
  useLanguage(language: string): void {
    this.translate.use(language);
    this.currentLang = language;
  }
}
