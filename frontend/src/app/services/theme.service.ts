import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = false;

  constructor() {
    const storedTheme = localStorage.getItem('weather_system_theme');
    if (storedTheme === 'dark') {
      this.darkMode = true;
      document.body.classList.add('dark-mode');
    } else {
      this.darkMode = false;
      document.body.classList.remove('dark-mode');
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('weather_system_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('weather_system_theme', 'light');
    }
  }
}