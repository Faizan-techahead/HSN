import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', {
      name: 'Sign in to your account',
    });
  }

  get emailInput() {
    return this.page.getByRole('textbox', {
      name: 'Enter Email Address',
    });
  }

  get passwordInput() {
    return this.page.getByRole('textbox', {
      name: 'Enter Password',
    });
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Log In' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
