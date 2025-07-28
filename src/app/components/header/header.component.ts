import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  languages = [
    { label: 'Français', code: 'fr', flag: 'https://flagcdn.com/w40/fr.png' },
    { label: 'English', code: 'en', flag: 'https://flagcdn.com/w40/gb.png' },
    { label: 'العربية', code: 'ar', flag: 'https://flagcdn.com/w40/sa.png' },
    { label: 'Español', code: 'es', flag: 'https://flagcdn.com/w40/es.png' }
  ];

  selectedLanguage = 'fr';
  selectedCurrency = 'MAD';
  showLangDropdown = false;

  currencies = ['MAD', 'USD', 'EUR', 'GBP', 'CAD', 'JPY', 'CNY'];

  toggleLangDropdown() {
    this.showLangDropdown = !this.showLangDropdown;
  }

  selectLanguage(code: string) {
    this.selectedLanguage = code;
    this.showLangDropdown = false;
  }

  getLabel(code: string): string {
    return this.languages.find(lang => lang.code === code)?.label || '';
  }

  getFlag(code: string): string {
    return this.languages.find(lang => lang.code === code)?.flag || '';
  }
}
