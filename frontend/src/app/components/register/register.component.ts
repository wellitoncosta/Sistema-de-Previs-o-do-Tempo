import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  novoUsuario = { nome: '', email: '', senha: '', confirmarSenha: '' };
  mensagem = '';
  isDarkMode = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark-mode');
  }

  registrar() {
    if (this.novoUsuario.senha !== this.novoUsuario.confirmarSenha) {
      this.mensagem = "As senhas não coincidem!";
      return;
    }

    this.authService.register(this.novoUsuario).subscribe({
      next: (res) => {
        if (res.success) {
          this.mensagem = "Conta criada com sucesso! Redirecionando...";
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.mensagem = res.message;
        }
      },
      error: (err) => {
        this.mensagem = "Erro ao conectar ao servidor.";
        console.error(err);
      }
    });
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
