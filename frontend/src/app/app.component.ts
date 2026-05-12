import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Injetar como 'public' permite usar no HTML sem erro
  constructor(
    public themeService: ThemeService,
    private readonly translate: TranslateService
  ) {
    // Carrega idioma das preferências do usuário se existir
    const savedPrefs = localStorage.getItem('user_prefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      this.translate.use(prefs.idioma || 'pt');
    } else {
      this.translate.use('pt');
    }
  }
}