class ThemeService {
  private isLightMode: boolean;

  constructor() {
    this.isLightMode = localStorage.getItem('themeColor') === 'light_mode';
    this.applyTheme();
  }

  // Function to toggle between light and dark themes
  toggleTheme() {
    this.isLightMode = !this.isLightMode;

    localStorage.setItem('themeColor', this.isLightMode ? 'light_mode' : 'dark_mode');
    this.applyTheme();
  }

  applyTheme() {
    if (this.isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }
}

export default new ThemeService();
