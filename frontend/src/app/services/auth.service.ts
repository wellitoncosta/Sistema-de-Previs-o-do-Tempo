import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Caminho para a pasta de autenticação no teu WampServer
  private baseUrl = 'http://localhost/weather-system/backend/auth';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login.php`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register.php`, userData);
  }

  getProfile(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/get_profile.php`, { id });
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_profile.php`, userData);
  }
}
