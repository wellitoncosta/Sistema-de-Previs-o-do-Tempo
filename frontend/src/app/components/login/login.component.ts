import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  message = '';
  isDarkMode = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    // Sincroniza o estado inicial do tema
    this.isDarkMode = document.body.classList.contains('dark-mode');
  }

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = "Login com sucesso! Bem-vindo.";
          localStorage.setItem('user_id', res.user.id);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          this.message = res.message || "Erro nas credenciais.";
        }
      },
      error: (err) => {
        this.message = "Erro de conexão. Verifique o WampServer.";
        console.error('Erro:', err);
      }
    });
  }

  irParaRegisto() {
    this.router.navigate(['/register']);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
