import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cidade: string = '';
  dadosClima: any = null;
  previsao: any[] = [];
  today: Date = new Date();

  // Variáveis para o Histórico
  historicoCidades: any[] = [];
  showHistoryModal = false;
  isCurrentFavorite = false;

  // Preferências do usuário
  preferences: any = {
    idioma: 'pt',
    unidade: 'celsius',
    notificacoes: true,
    tema: 'escuro'
  };

  constructor(
    private readonly weatherService: WeatherService,
    public themeService: ThemeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Carrega preferências do usuário
    this.loadUserPreferences();

    // Mantém o tema atual do ThemeService sem forçar alteração a cada entrada
    // Verifica se há uma cidade para pesquisar via query params
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.cidade = params['search'];
        this.consultarClima();
      } else {
        this.cidade = 'Luanda';
        this.consultarClima();
      }
    });
  }

  loadUserPreferences() {
    const savedPrefs = localStorage.getItem('user_prefs');
    if (savedPrefs) {
      this.preferences = JSON.parse(savedPrefs);
    }
  }

  get isDarkMode() {
    return this.themeService.darkMode;
  }

  // Método para converter temperatura baseado na preferência
  convertTemperature(temp: number): number {
    if (this.preferences.unidade === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  }

  // Método para obter o símbolo da unidade
  getTemperatureUnit(): string {
    return this.preferences.unidade === 'fahrenheit' ? '°F' : '°C';
  }

  consultarClima() {
    if (!this.cidade) return;

    const userId = localStorage.getItem('user_id');
    const dadosParaEnviar = {
      cidade: this.cidade,
      utilizador_id: userId
    };

    this.weatherService.getWeather(dadosParaEnviar).subscribe({
      next: (res) => {
        this.dadosClima = res;
        this.carregarPrevisao();
        this.verificarFavorito();
        this.carregarHistoricoReduzido(); // Atualiza o histórico lateral
      },
      error: (err) => console.error("Erro na consulta:", err)
    });
  }

  carregarPrevisao() {
    if (!this.cidade) return;
    this.weatherService.getForecast(this.cidade).subscribe({
      next: (res) => {
        // Filtrar para pegar apenas 1 previsão por dia (ex: meio-dia)
        this.previsao = res.list.filter((item: any) => item.dt_txt.includes('12:00:00')).slice(0, 7);
      },
      error: (err) => console.error("Erro na previsão:", err)
    });
  }

  carregarFavoritos() {
    // Mantemos o método mas não o chamamos no ngOnInit do dashboard se não for usado lá
    // Mas precisamos dele para o toggleFavorite
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.weatherService.getFavorites(userId).subscribe({
        next: (res) => {
          if (res.success) {
            this.verificarFavoritoIndividual(res.favoritos);
          }
        }
      });
    }
  }

  verificarFavoritoIndividual(favoritos: any[]) {
    if (this.dadosClima && favoritos) {
      this.isCurrentFavorite = favoritos.some(f => f.cidade.toLowerCase() === this.dadosClima.name.toLowerCase());
    }
  }

  verificarFavorito() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.weatherService.getFavorites(userId).subscribe({
        next: (res) => {
          if (res.success) {
            this.isCurrentFavorite = res.favoritos.some((f: any) => f.cidade.toLowerCase() === this.dadosClima.name.toLowerCase());
          }
        }
      });
    }
  }

  carregarHistoricoReduzido() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.weatherService.getHistory(userId).subscribe({
        next: (res) => {
          if (res.success) {
            this.historicoCidades = res.cidades;
          }
        }
      });
    }
  }

  toggleFavorite() {
    const userId = localStorage.getItem('user_id');
    if (userId && this.dadosClima) {
      this.weatherService.toggleFavorite(userId, this.dadosClima.name).subscribe({
        next: (res) => {
          if (res.success) {
            this.isCurrentFavorite = res.isFavorite;
            this.carregarFavoritos();
          }
        }
      });
    }
  }

  abrirHistorico() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.weatherService.getHistory(userId).subscribe({
        next: (res) => {
          if (res.success) {
            this.historicoCidades = res.cidades;
            this.showHistoryModal = true;
          }
        },
        error: (err) => console.error("Erro ao carregar histórico:", err)
      });
    }
  }

  pesquisarDoHistorico(cidade: string) {
    this.cidade = cidade;
    this.consultarClima();
    this.showHistoryModal = false;
  }

  baixarRelatorio() {
    // Caminho absoluto para o backend
    window.open('http://localhost/weather-system/backend/reports/export_csv.php', '_blank');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

