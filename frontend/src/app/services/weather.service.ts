import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'http://localhost/weather-system/backend/weather';

  constructor(private http: HttpClient) {}

  getWeather(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/weather.php`, data);
  }

  getForecast(cidade: string): Observable<any> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=31b9bf5f5092b32f886261ae9324955f&units=metric&lang=pt_br`);
  }

  getHistory(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/get_history.php`, { utilizador_id: userId });
  }

  toggleFavorite(userId: string, cidade: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/toggle_favorite.php`, { utilizador_id: userId, cidade: cidade });
  }

  getFavorites(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/get_favorites.php`, { utilizador_id: userId });
  }

  checkIsFavorite(userId: string, cidade: string): Observable<any> {
    // Reutiliza o toggle_favorite ou cria um check_favorite específico se necessário
    // Para simplificar, vamos verificar na lista de favoritos carregada no componente
    return this.http.post(`${this.baseUrl}/get_favorites.php`, { utilizador_id: userId });
  }
}
