import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  message = '';
  isDarkMode = false;

  // Fluxo de Recuperação de Senha
  exibirRecuperacao = false;
  subStepRecuperar = 1; // 1: Email, 2: Código, 3: Nova Senha
  emailRecuperacao = '';
  codigoGeradoRecuperar = '';
  codigoIntroduzidoRecuperar = '';
  novaSenhaRecuperar = '';
  confirmarSenhaRecuperar = '';
  msgRecuperacao = '';

  // TODO: Substitui com as tuas credenciais do EmailJS
  private readonly EMAILJS_PUBLIC_KEY = '0Jfoa9ehr1rrlYFeT'; 
  private readonly EMAILJS_SERVICE_ID = 'service_x0chfyo';
  private readonly EMAILJS_TEMPLATE_ID = 'template_u64wsgm';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark-mode');
    // Inicializa o EmailJS diretamente aqui
    emailjs.init(this.EMAILJS_PUBLIC_KEY);
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

  // ==========================================
  // FUNÇÕES DE RECUPERAÇÃO DIRETAS DO EMAILJS
  // ==========================================
  abrirRecuperacao() {
    this.exibirRecuperacao = true;
    this.subStepRecuperar = 1;
    this.msgRecuperacao = '';
    this.emailRecuperacao = '';
  }

  voltarAoLogin() {
    this.exibirRecuperacao = false;
    this.message = '';
  }

  enviarCodigoRecuperacao() {
    if (!this.emailRecuperacao) {
      this.msgRecuperacao = 'Por favor, insira o seu e-mail.';
      return;
    }

    // 1. Gera o token de 6 dígitos para a recuperação
    this.codigoGeradoRecuperar = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. CORREÇÃO: Altera 'verification_code' para 'codigo' para mapear com o teu painel EmailJS
    const templateParams = {
      to_email: this.emailRecuperacao,
      to_name: 'Utilizador Cloudly',
      codigo: this.codigoGeradoRecuperar // Agora o EmailJS vai ler a propriedade correta!
    };

    this.msgRecuperacao = 'A enviar código de verificação...';

    // 3. Executa o envio passando a tua Public Key para validar a chamada
    emailjs.send(
      this.EMAILJS_SERVICE_ID, 
      this.EMAILJS_TEMPLATE_ID, 
      templateParams, 
      this.EMAILJS_PUBLIC_KEY
    )
    .then((response) => {
      console.log("Código de recuperação enviado com sucesso:", response.status);
      this.msgRecuperacao = 'Código enviado! Verifique a sua caixa de entrada.';
      this.subStepRecuperar = 2; // Avança para o passo de introduzir o código
    })
    .catch((err) => {
      console.error("Erro ao enviar e-mail de recuperação:", err);
      this.msgRecuperacao = 'Erro ao enviar o e-mail. Verifique as chaves e tente novamente.';
    });
  }

  verificarCodigoRecuperacao() {
    if (this.codigoIntroduzidoRecuperar === this.codigoGeradoRecuperar && this.codigoGeradoRecuperar !== '') {
      this.subStepRecuperar = 3;
      this.msgRecuperacao = 'Código validado! Introduza a sua nova senha.';
    } else {
      this.msgRecuperacao = 'Código incorreto. Verifique e tente novamente.';
    }
  }

  submeterNovaSenhaRecuperar() {
    if (this.novaSenhaRecuperar !== this.confirmarSenhaRecuperar) {
      this.msgRecuperacao = 'As senhas não coincidem!';
      return;
    }
    if (this.novaSenhaRecuperar.length < 6) {
      this.msgRecuperacao = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    // Chama o teu service para atualizar a tabela de utilizadores no MySQL via PHP
    this.authService.updatePasswordByEmail(this.emailRecuperacao, this.novaSenhaRecuperar).subscribe({
      next: (res:any) => {
        if (res.success) {
          this.msgRecuperacao = 'Senha recuperada com sucesso! A voltar...';
          setTimeout(() => {
            this.exibirRecuperacao = false;
            this.credentials.email = this.emailRecuperacao;
          }, 2000);
        } else {
          this.msgRecuperacao = res.message || 'Erro ao atualizar a senha.';
        }
      },
      error: () => {
        this.msgRecuperacao = 'Erro ao conectar ao WampServer para atualizar a senha.';
      }
    });
  }
}