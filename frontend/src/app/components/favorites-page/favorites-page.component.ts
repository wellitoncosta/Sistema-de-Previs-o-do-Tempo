import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent implements OnInit {
  cidadesFavoritas: any[] = [];
  loading = true;

  constructor(
    private weatherService: WeatherService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarFavoritos();
  }

  carregarFavoritos() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.loading = true;
      this.weatherService.getFavorites(userId).subscribe({
        next: (res) => {
          if (res.success) {
            this.cidadesFavoritas = res.favoritos;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error("Erro ao carregar favoritos:", err);
          this.loading = false;
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  verClima(cidade: string) {
    // Redireciona para a dashboard e pesquisa a cidade
    // Poderíamos usar um serviço compartilhado ou passar via query params
    this.router.navigate(['/dashboard'], { queryParams: { search: cidade } });
  }

  removerFavorito(cidade: string, event: Event) {
    event.stopPropagation();
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.weatherService.toggleFavorite(userId, cidade).subscribe({
        next: (res) => {
          if (res.success) {
            this.carregarFavoritos();
          }
        }
      });
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
