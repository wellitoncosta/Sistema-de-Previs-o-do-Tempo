import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-export-page',
  templateUrl: './export-page.component.html',
  styleUrls: ['./export-page.component.css']
})
export class ExportPageComponent {
  constructor(
    public themeService: ThemeService,
    private readonly router: Router
  ) {}

  exportCsv() {
    window.open('http://localhost/weather-system/backend/reports/export_csv.php', '_blank');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
