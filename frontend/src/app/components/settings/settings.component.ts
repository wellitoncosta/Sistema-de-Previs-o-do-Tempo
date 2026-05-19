import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user: any = { 
    id: '', 
    nome: '', 
    email: '', 
    senhaAtual: '', 
    senha: '', 
    confirmarSenha: '' 
  };

  preferences: any = {
    idioma: 'pt',
    unidade: 'celsius',
    notificacoes: true,
    tema: 'escuro'
  };

  mensagem = '';
  mensagemModal = '';
  isDarkMode = true;
  showVerifyModal = false;

  codigoGeradoSettings = '';
  codigoIntroduzidoSettings = '';

  // ========================================================
  // INSERE AQUI AS TUAS CREDENCIAIS REAIS DO PAINEL EMAILJS:
  // ========================================================
  private readonly EMAILJS_PUBLIC_KEY = '0Jfoa9ehr1rrlYFeT';
  private readonly EMAILJS_SERVICE_ID = 'service_x0chfyo';
  private readonly EMAILJS_TEMPLATE_ID = 'template_u64wsgm';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark-mode');
    
    emailjs.init(this.EMAILJS_PUBLIC_KEY);
    
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.authService.getProfile(userId).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.user = { 
              id: res.user.id,
              nome: res.user.nome,
              email: res.user.email,
              senhaAtual: '', 
              senha: '', 
              confirmarSenha: '' 
            };
          }
        },
        error: () => {
          this.mensagem = "Erro ao obter os dados do perfil do servidor.";
        }
      });

      const savedPrefs = localStorage.getItem('user_prefs');
      if (savedPrefs) {
        this.preferences = JSON.parse(savedPrefs);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  onIdiomaChange() {
    this.translate.use(this.preferences.idioma);
    localStorage.setItem('user_prefs', JSON.stringify(this.preferences));
  }

  onUnidadeChange() {
    localStorage.setItem('user_prefs', JSON.stringify(this.preferences));
  }

  abrirVerificacao() {
    this.mensagem = '';
    this.mensagemModal = '';

    if (!this.user.senhaAtual) {
      this.mensagem = "Precisa de introduzir a sua senha atual para aplicar alterações.";
      return;
    }

    if (this.user.senha) {
      if (this.user.senha.length < 6) {
        this.mensagem = "A nova senha deve possuir pelo menos 6 caracteres.";
        return;
      }
      if (this.user.senha !== this.user.confirmarSenha) {
        this.mensagem = "A nova senha e a confirmação não coincidem.";
        return;
      }
    }

    this.mensagem = "A validar identidade com o servidor...";

    const loginData = { email: this.user.email, password: this.user.senhaAtual };
    this.authService.login(loginData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.enviarCodigoSeguranca();
        } else {
          this.mensagem = "A senha atual introduzida está incorreta.";
        }
      },
      error: () => {
        this.mensagem = "Erro ao conectar ao WampServer para validar credenciais.";
      }
    });
  }

  enviarCodigoSeguranca() {
    this.codigoGeradoSettings = Math.floor(100000 + Math.random() * 900000).toString();

    // CORREÇÃO AQUI: Chave alterada para 'codigo' para bater certo com o teu painel EmailJS
    const templateParams = {
      to_email: this.user.email,
      to_name: this.user.nome || 'Utilizador Cloudly',
      codigo: this.codigoGeradoSettings
    };

    this.mensagem = "Código de segurança enviado para o seu e-mail!";
    this.showVerifyModal = true; 
    this.codigoIntroduzidoSettings = '';

    emailjs.send(
      this.EMAILJS_SERVICE_ID, 
      this.EMAILJS_TEMPLATE_ID, 
      templateParams, 
      this.EMAILJS_PUBLIC_KEY
    )
    .then((response) => {
      console.log("Token enviado com sucesso:", response.status, response.text);
    })
    .catch((err) => {
      console.error("Erro no EmailJS:", err);
      this.mensagemModal = "Erro ao disparar o e-mail de segurança. Tente novamente.";
    });
  }

  verificarCodigoSeguranca() {
    if (this.codigoIntroduzidoSettings === this.codigoGeradoSettings && this.codigoGeradoSettings !== '') {
      this.mensagemModal = '';
      this.mensagem = "Código validado com sucesso! A guardar dados...";
      this.showVerifyModal = false;
      this.confirmarESalvar();
    } else {
      this.mensagemModal = "Código incorreto. Verifique e tente novamente.";
    }
  }

  confirmarESalvar() {
    this.authService.updateProfile(this.user).subscribe({
      next: (res: any) => {
        if (res.success) {
          localStorage.setItem('user_prefs', JSON.stringify(this.preferences));
          this.mensagem = "Definições atualizadas com sucesso!";
          
          this.user.senhaAtual = '';
          this.user.senha = '';
          this.user.confirmarSenha = '';
          
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        } else {
          this.mensagem = res.message || "Erro ao salvar as atualizações no perfil.";
        }
      },
      error: () => {
        this.mensagem = "Erro de rede ao efetuar a atualização no WampServer.";
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