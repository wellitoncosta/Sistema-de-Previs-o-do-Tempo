import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Caminho padrão para a pasta de autenticação no teu WampServer
  private readonly baseUrl = 'http://localhost/weather-system/backend/auth';

  constructor(private readonly http: HttpClient) {}

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

  /**
   * Atualiza a senha do utilizador através do e-mail (Fluxo de Recuperação)
   */
    updatePasswordByEmail(email: string, novaSenha: string): Observable<any> {
    // CORREÇÃO: Aponta exatamente para o baseUrl (que já inclui /auth) e usa o nome real do teu ficheiro PHP
    return this.http.post(`${this.baseUrl}/recover_password.php`, { email, novaSenha });
  }
}