import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user: any = { id: '', nome: '', email: '', senha: '', confirmarSenha: '' };
  preferences: any = {
    idioma: 'pt',
    unidade: 'celsius',
    notificacoes: true,
    tema: 'escuro'
  };

  mensagem = '';
  isDarkMode = true;
  showVerifyModal = false;
  verifyPassword = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark-mode');
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.authService.getProfile(userId).subscribe({
        next: (res) => {
          if (res.success) {
            this.user = { ...res.user, senha: '', confirmarSenha: '' };
          }
        }
      });
      // Carrega preferências se existirem no localStorage
      const savedPrefs = localStorage.getItem('user_prefs');
      if (savedPrefs) {
        this.preferences = JSON.parse(savedPrefs);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Método para aplicar mudanças de idioma imediatamente
  onIdiomaChange() {
    this.translate.use(this.preferences.idioma);
    localStorage.setItem('user_prefs', JSON.stringify(this.preferences));
  }

  // Método para aplicar mudanças de unidade imediatamente
  onUnidadeChange() {
    localStorage.setItem('user_prefs', JSON.stringify(this.preferences));
  }

  abrirVerificacao() {
    this.showVerifyModal = true;
  }

  confirmarESalvar() {
    if (!this.verifyPassword) {
      this.mensagem = "Por favor, insira sua senha para confirmar.";
      return;
    }

    // Primeiro valida a senha atual (simulação simplificada ou endpoint real)
    const loginData = { email: this.user.email, password: this.verifyPassword };
    this.authService.login(loginData).subscribe({
      next: (res) => {
        if (res.success) {
          this.executarAtualizacao();
        } else {
          this.mensagem = "Senha incorreta. Verificação falhou.";
          this.showVerifyModal = false;
          this.verifyPassword = '';
        }
      },
      error: () => {
        this.mensagem = "Erro ao validar senha.";
        this.showVerifyModal = false;
      }
    });
  }

  executarAtualizacao() {
    this.authService.updateProfile(this.user).subscribe({
      next: (res) => {
        if (res.success) {
          localStorage.setItem('user_prefs', JSON.stringify(this.preferences));
          this.mensagem = "Perfil e preferências atualizados com sucesso!";
          this.showVerifyModal = false;
          this.verifyPassword = '';
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        } else {
          this.mensagem = res.message;
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
